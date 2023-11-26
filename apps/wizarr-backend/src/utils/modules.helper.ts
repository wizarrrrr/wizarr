import { addAliases } from "module-alias";
import { rootPath } from "../config/paths";

export const registerModuleAlias = (dirName: string) => {
    addAliases({
        "@": dirName,
        "@root": rootPath,
        "@base": dirName,
        "@config": `${dirName}/config`,
        "@api": `${dirName}/api`,
    });
};
