import { resolve } from "path";
import { register } from "tsconfig-paths";

// Register the module alias
register({
    baseUrl: resolve(process.env.ROOT_PATH),
    paths: {
        "@decorators/*": ["./src/decorators/*"],
        "@media/*": ["./src/media/*"],
        "@config/*": ["./src/config/*"],
        "@utils/*": ["./src/utils/*"],
        "@api/*": ["./src/api/*"],
    },
});
