import { Options } from './Options';
export declare class RecursionDepth {
    private options;
    private fileRecursionDepth;
    private packageRecursionDepth;
    constructor(options: Options, fileRecursionDepth?: number, packageRecursionDepth?: number);
    nextPackage(): RecursionDepth;
    nextFile(): RecursionDepth;
    same(): RecursionDepth;
    shouldStop(): boolean;
}
