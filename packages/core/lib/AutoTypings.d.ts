import { Options } from './Options';
export declare class AutoTypings implements monaco.IDisposable {
    private editor;
    private options;
    private static sharedCache?;
    private importResolver;
    private debounceTimer?;
    private isResolving?;
    private disposables;
    private constructor();
    static create(editor: monaco.editor.ICodeEditor, monaco: any, options?: Partial<Options>): AutoTypings;
    dispose(): void;
    setVersions(versions: {
        [packageName: string]: string;
    }): void;
    clearCache(): Promise<void>;
    private debouncedResolveContents;
    private resolveContents;
}
