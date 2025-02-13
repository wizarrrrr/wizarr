import { defineStore } from "pinia";
import type { Admin } from "@wizarrrrr/wizarr-sdk";
import router from "@/router";

export type AuthStoreState = {
    user: UserInterface | null;
    refreshTokenTimeout: NodeJS.Timeout | null;
};

export interface UserInterface extends Admin {
    jwtToken: string;
}

export type LoginResponse = {
    user: Admin;
    token: string;
};

export const useAuthStore = defineStore("auth", {
    state: (): AuthStoreState => ({
        user: null,
        refreshTokenTimeout: null,
    }),
    actions: {
        loginRedirect() {
            // Decode the URL query parameter `url` and redirect to it
            const urlParam = new URLSearchParams(window.location.search).get("url");
            if (urlParam) router.push(decodeURIComponent(urlParam));
            else router.push("/admin");
        },
        async passwordLogin(username: string, password: string) {
            const loginResponse = await this.$axios.post<LoginResponse>("/api/auth/login", { username, password });
            this.user = { ...loginResponse.data.user, jwtToken: loginResponse.data.token };
            this.startRefreshTokenTimer();
            this.loginRedirect();
        },
        logout() {
            this.$axios.get("/api/auth/logout");
            this.stopRefreshTokenTimer();
            this.user = null;
            router.push("/login");
        },
        async refreshToken() {
            const refreshResponse = await this.$axios.get<LoginResponse>("/api/auth/refresh");
            this.user = { ...refreshResponse.data.user, jwtToken: refreshResponse.data.token };
            this.startRefreshTokenTimer();
        },
        startRefreshTokenTimer() {
            if (!this.user) return this.logout();

            // parse json object from base64 encoded jwt token
            const jwtBase64 = this.user.jwtToken.split(".")[1];
            const jwtToken = JSON.parse(atob(jwtBase64));

            // set a timeout to refresh the token a minute before it expires
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - 60 * 1000;

            this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
        },
        stopRefreshTokenTimer() {
            if (!!this.refreshTokenTimeout) clearTimeout(this.refreshTokenTimeout);
        },
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        isLoggedIn(state) {
            return !!state.user;
        },
    },
});
