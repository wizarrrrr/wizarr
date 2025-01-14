import { resolve } from "path";
import { register } from "tsconfig-paths";

export const registerModuleAlias = (src: string) => {
    register({
        baseUrl: resolve(src, "../"),
        paths: {
            "@decorators/*": ["./src/decorators/*"],
            "@media/*": ["./src/media/*"],
            "@config/*": ["./src/config/*"],
            "@utils/*": ["./src/utils/*"],
            "@api/*": ["./src/api/*"],
        },
    });
};
