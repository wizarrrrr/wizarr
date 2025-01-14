import { defineStore } from "pinia";
import { useJwt } from "@vueuse/integrations/useJwt";

export type AuthStoreState = {
    token: string | null;
};

export const useAuthStore = defineStore("auth", {
    state: (): AuthStoreState => ({
        token: null,
    }),
    getters: {
        getAccessToken: (state) => {
            return state.token;
        },
    },
    actions: {
        isAuthenticated() {
            return !this.isAccessTokenExpired();
        },
        setAccessToken(token: string) {
            this.token = token;
        },
        removeAccessToken() {
            this.token = null;
        },
        isAccessTokenExpired() {
            if (!this.token) return true;
            const { payload } = useJwt(this.token);
            if (payload.value?.exp && payload.value?.exp < Date.now() / 1000) return true;
            return false;
        },
    },
    persist: true,
});
