import { IDisposable, editor } from "@typescript-deploys/monaco-editor";
import { Options } from './Options';
import Monaco from "@typescript-deploys/monaco-editor";
export declare class AutoTypings implements IDisposable {
    private editor;
    private options;
    private static sharedCache?;
    private importResolver;
    private debounceTimer?;
    private isResolving?;
    private disposables;
    private constructor();
    static create(editor: editor.ICodeEditor, monaco: typeof Monaco, options?: Partial<Options>): AutoTypings;
    dispose(): void;
    setVersions(versions: {
        [packageName: string]: string;
    }): void;
    clearCache(): Promise<void>;
    private debouncedResolveContents;
    private resolveContents;
}
