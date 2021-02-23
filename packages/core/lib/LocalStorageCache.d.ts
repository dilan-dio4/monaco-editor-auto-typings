import { SourceCache } from './SourceCache';
export declare class LocalStorageCache implements SourceCache {
    static LOCALSTORAGE_PREFIX: string;
    getFile(uri: string): Promise<string | undefined>;
    storeFile(uri: string, content: string): Promise<void>;
    clear(): Promise<void>;
}
