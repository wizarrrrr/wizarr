import { defineStore } from "pinia";
import type { Version as IVersion } from "@wizarrrrr/wizarr-sdk";

export const useVersionStore = defineStore("version", {
    state: (): IVersion => ({
        currentVersion: "",
        latestVersion: "",
        latestStableVersion: "",
        latestBetaVersion: "",
        isBeta: false,
        isLatest: true,
        versionInfo: {},
    }),
    actions: {
        setVersionData(version_data: Partial<IVersion> | undefined) {
            if (version_data !== undefined) {
                Object.keys(version_data).forEach((key: string) => {
                    if ((this as any)[key] !== undefined) (this as any)[key] = (version_data as { [key: string]: any })[key];
                });
            }
        },
    },
    persist: true,
});
