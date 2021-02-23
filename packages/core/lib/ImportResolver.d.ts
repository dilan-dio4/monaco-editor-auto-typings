import { Options } from './Options';
import { ImportResourcePath } from './ImportResourcePath';
import { RecursionDepth } from './RecursionDepth';
export declare class ImportResolver {
    private options;
    private loadedFiles;
    private dependencyParser;
    private cache;
    private sourceResolver;
    private versions?;
    private newImportsResolved;
    constructor(options: Options);
    wereNewImportsResolved(): boolean;
    resetNewImportsResolved(): void;
    resolveImportsInFile(source: string, parent: string | ImportResourcePath, depth: RecursionDepth): Promise<void>;
    private resolveImport;
    private resolveImportInPackage;
    private resolveImportFromPackageRoot;
    private loadSourceFileContents;
    private getVersion;
    setVersions(versions: {
        [packageName: string]: string;
    }): void;
    private setVersion;
    private createModel;
    private hashImportResourcePath;
    private resolvePackageJson;
    private resolveSourceFile;
}
