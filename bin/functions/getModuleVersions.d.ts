export default function (module: string): Promise<moduleVersions | {
    error: boolean;
}>;
interface moduleVersions {
    versionTags: {
        latest: string;
        [name: string]: string;
    };
    versions: {
        version: string;
        deprecated?: string;
    }[];
}
export declare function instanceOfModuleVersions(object: any): object is moduleVersions;
export {};
