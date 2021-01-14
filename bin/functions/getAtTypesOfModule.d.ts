/**
 * Returns `{ builtin: true }` if the main module has built-in types.
 *
 * Returns `{ buildin: false }` if the main module has no built-in types and there isn't a specific module for it.
 *
 * Returns `{ builtin: false, typesModule: "@types/module"}` if the main module has no built-in types, but there is a specific module for it.
 *
 * Returns `{ error: true }` if there was no module found with the name inputted.
 * @param module Module to search if it has types
 */
export declare function getAtTypesOfModule(module: string): Promise<{
    builtin?: boolean;
    typesModule?: string;
    error?: true;
}>;
export declare function getAvailableAtTypesOfModules(modules: string[]): Promise<string[]>;
