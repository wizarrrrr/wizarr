import { OpenAPIObject, SchemaObject } from "openapi3-ts";
import { getCurrentVersion } from "../utils/versions.helper";
import { getDescription, getLicense } from "../utils/github.helper";

export const swaggerConfig = async (schemas: Record<string, SchemaObject>): Promise<Partial<OpenAPIObject>> => {
    const description = (await getDescription()) ?? "Wizarr is a media server";
    const currentVersion = (await getCurrentVersion()) ?? "0.0.0";
    const license = (await getLicense()) ?? { name: "MIT" };

    return {
        info: {
            title: "Wizarr API",
            description: description,
            version: currentVersion,
            contact: {
                name: "Wizarr Support",
                email: "support@wizarr.dev",
            },
            license: {
                name: license.name,
                url: "https://opensource.org/license/" + (license.key ?? "mit"),
            },
        },
        components: {
            schemas,
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        externalDocs: {
            description: "Find out more about Wizarr",
            url: "https://wizarr.dev",
        },
    };
};
