export {};
import { ComponentInternalInstance } from "vue";

export declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        __: (
            msgid: string,
            parameters?: {
                [key: string]: string;
            },
            disableHtmlEscaping?: boolean,
        ) => string;
        _x: (
            context: string,
            msgid: string,
            parameters?: {
                [key: string]: string;
            },
            disableHtmlEscaping?: boolean,
        ) => string;
        _n: (
            msgid: string,
            plural: string,
            n: number,
            parameters?: {
                [key: string]: string;
            },
            disableHtmlEscaping?: boolean,
        ) => string;
        _xn: (
            context: string,
            msgid: string,
            plural: string,
            n: number,
            parameters?: {
                [key: string]: string;
            },
            disableHtmlEscaping?: boolean,
        ) => string;
    }

    interface ComponentInternalInstance {
        proxy: {
            __: ComponentCustomProperties["__"];
            _x: ComponentCustomProperties["_x"];
            _n: ComponentCustomProperties["_n"];
            _xn: ComponentCustomProperties["_xn"];
        };
    }
}

export {};
