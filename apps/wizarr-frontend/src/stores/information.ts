import { defineStore } from "pinia";
import type { Information as IInformation } from "@wizarrrrr/wizarr-sdk";

export const useInformationStore = defineStore("information", {
    state: (): IInformation => ({
        name: "",
        description: "",
        version: "",
        updateAvailable: false,
        debug: false,
        setupRequired: false,
        bugReporting: false,
    }),
    getters: {
        isBugReporting(state) {
            return state.bugReporting;
        },
    },
    actions: {
        setServerData(data: Partial<IInformation> | undefined) {
            if (data !== undefined) {
                Object.keys(data).forEach((key: string) => {
                    if ((this as any)[key] !== undefined) (this as any)[key] = (data as { [key: string]: any })[key];
                });
            }
        },
    },
    persist: true,
});
