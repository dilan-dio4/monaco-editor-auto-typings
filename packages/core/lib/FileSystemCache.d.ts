import { SourceCache } from './SourceCache';
export declare class FileSystemCache implements SourceCache {
    private basePath;
    constructor(basePath: string);
    getFile(uri: string): Promise<string | undefined>;
    clear(): Promise<void>;
    storeFile(uri: string, content: string): Promise<void>;
    private simplifyUri;
}
