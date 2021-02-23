// import { editor, IDisposable, languages } from 'monaco-editor';
import { SourceCache } from './SourceCache';
import { Options } from './Options';
import { DummySourceCache } from './DummySourceCache';
import { UnpkgSourceResolver } from './UnpkgSourceResolver';
import { ImportResolver } from './ImportResolver';
import * as path from 'path';
// import * as monaco from 'monaco-editor';
import { invokeUpdate } from './invokeUpdate';
import { RecursionDepth } from './RecursionDepth';
import Globals from "./Globals";

export class AutoTypings implements monaco.IDisposable {
  private static sharedCache?: SourceCache;
  private importResolver: ImportResolver;
  private debounceTimer?: number;
  private isResolving?: boolean;
  private disposables: monaco.IDisposable[];

  private constructor(private editor: monaco.editor.ICodeEditor, monaco: any, private options: Options) {

    this.disposables = [];
    this.importResolver = new ImportResolver(options);
    const changeModelDisposable = editor.onDidChangeModelContent(e => {
      this.debouncedResolveContents();
    });
    this.disposables.push(changeModelDisposable);
    this.resolveContents();
    if (!options.dontAdaptEditorOptions) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
        moduleResolution: 2,
        allowSyntheticDefaultImports: true,
      });
    }
  }

  public static create(editor: monaco.editor.ICodeEditor, monaco: any, options?: Partial<Options>): AutoTypings {
    if (options?.shareCache && options.sourceCache && !AutoTypings.sharedCache) {
      AutoTypings.sharedCache = options.sourceCache;
    }

    Globals.monacoRef = monaco;
    
    return new AutoTypings(editor, monaco, {
      fileRootPath: 'inmemory://model/',
      onlySpecifiedPackages: false,
      preloadPackages: false,
      shareCache: false,
      dontAdaptEditorOptions: false,
      dontRefreshModelValueAfterResolvement: false,
      sourceCache: AutoTypings.sharedCache ?? new DummySourceCache(),
      sourceResolver: new UnpkgSourceResolver(),
      debounceDuration: 4000,
      fileRecursionDepth: 10,
      packageRecursionDepth: 3,
      ...options,
    });
  }

  public dispose() {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }

  public setVersions(versions: { [packageName: string]: string }) {
    this.importResolver.setVersions(versions);
    this.options.versions = versions;
  }

  public async clearCache() {
    await this.options.sourceCache.clear();
  }

  private debouncedResolveContents() {
    if (this.isResolving) {
      return;
    }

    invokeUpdate(
      {
        type: 'CodeChanged',
      },
      this.options
    );

    if (this.options.debounceDuration <= 0) {
      this.resolveContents();
    } else {
      if (this.debounceTimer !== undefined) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(async () => {
        await this.resolveContents();
        this.debounceTimer = undefined;
      }, this.options.debounceDuration) as any;
    }
  }

  private async resolveContents() {
    this.isResolving = true;
    invokeUpdate(
      {
        type: 'ResolveNewImports',
      },
      this.options
    );

    const model = this.editor.getModel();
    if (!model) {
      throw Error('No model');
    }

    const content = model.getLinesContent();

    try {
      await this.importResolver.resolveImportsInFile(
        content.join('\n'),
        path.dirname(model.uri.toString()),
        new RecursionDepth(this.options)
      );
    } catch (e) {
      if (this.options.onError) {
        this.options.onError((e as Error).message ?? e);
      } else {
        throw e;
      }
    }

    if (this.importResolver.wereNewImportsResolved()) {
      if (!this.options.dontRefreshModelValueAfterResolvement) {
        model.setValue(model.getValue());
      }
      this.importResolver.resetNewImportsResolved();
    }

    this.isResolving = false;
  }
}
