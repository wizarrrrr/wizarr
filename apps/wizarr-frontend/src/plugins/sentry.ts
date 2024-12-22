import DefaultToast from "@/components/Toasts/DefaultToast.vue";

import { BrowserTracing, Replay, init, vueRouterInstrumentation } from "@sentry/vue";

import type { App } from "vue";
import type { Information as IInformation } from "@wizarrrrr/wizarr-sdk";
import type { Options, TracingOptions } from "@sentry/vue/types/types";

type SentryOptions = Partial<
    Omit<Options, "tracingOptions"> & {
        tracingOptions: Partial<TracingOptions>;
    }
>;

const isBugReporting = () => {
    const localStorage = window.localStorage.getItem("server");

    if (localStorage !== null) {
        const server: IInformation = JSON.parse(localStorage);
        return server.bugReporting === false;
    }

    return true;
};

const vuePluginSentry = {
    install: (app: App, options?: SentryOptions) => {
        const bugReporting = isBugReporting();

        console.log("\x1b[32m%s\x1b[0m", "Sentry: Initializing");
        console.log(bugReporting ? "\x1b[31m%s\x1b[0m" : "\x1b[32m%s\x1b[0m", "Sentry: Bug Reporting is " + (bugReporting ? "OFF" : "ON"));

        if (bugReporting) return;

        init({
            app: app,
            dsn: "https://4034e578d899247f5121cbae3466e637@sentry.wizarr.org/2",
            integrations: [
                new BrowserTracing({
                    tracePropagationTargets: [location.origin],
                    routingInstrumentation: vueRouterInstrumentation(app.config.globalProperties.$router),
                }),
                new Replay({
                    maskAllText: false,
                    blockAllMedia: false,
                    maskAllInputs: false,
                }),
            ],
            environment: process.env.NODE_ENV,
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            beforeSend(event, hint) {
                if (event.exception) {
                    console.error(event, hint);

                    const originalException = hint.originalException as Error;
                    const message = originalException?.message;

                    if (message) {
                        app.config.globalProperties.$toast.error(DefaultToast("Error Message", message));
                        app.config.globalProperties.$toast.warning(DefaultToast("We noticed an error", `Errors occur sometimes naturally, but if you encounter behavior that seems wrong, please report it to us.`));
                    }
                }
                return event;
            },
            ...options,
        });
    },
};

export default vuePluginSentry;
