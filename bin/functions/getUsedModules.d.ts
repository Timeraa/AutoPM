export default function (path?: string): Promise<{
    usedModules: string[];
    unknownModules: string[];
}>;
