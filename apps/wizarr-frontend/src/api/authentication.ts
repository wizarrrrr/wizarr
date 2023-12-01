import { errorToast, infoToast } from "../ts/utils/toasts";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

import type { Membership } from "@/types/api/membership";
import type { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
import type { WebAuthnError } from "@simplewebauthn/browser/dist/types/helpers/webAuthnError";
import { useAuthStore } from "@/stores/auth";
import { useAxios } from "@/plugins/axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

import type { Admin as IAdmin } from "@wizarrrr/wizarr-sdk";

class Auth {
    // Local toast functions
    private errorToast = errorToast;
    private infoToast = infoToast;

    // Router and axios instance
    private router = useRouter();
    private axios = useAxios();

    // Store properties needed for the authentication class
    [key: string]: any;

    // Check if the browser supports webauthn
    browserSupportsWebAuthn() {
        return window?.PublicKeyCredential !== undefined && typeof window.PublicKeyCredential === "function";
    }

    // Check if the browser supports webauthn autofill
    async browserSupportsWebAuthnAutofill() {
        if (this.browserSupportsWebAuthn() === false) {
            return false;
        }

        if (typeof window.PublicKeyCredential.isConditionalMediationAvailable !== "function") {
            return false;
        }

        return (await window.PublicKeyCredential.isConditionalMediationAvailable()) === true;
    }

    /**
     * Create a new Authentication object
     * This class is used to login and logout the user and handle MFAs
     *
     * @returns An Authentication object
     */
    constructor() {
        this.axios.disableInfoToast = true;
    }

    /**
     * Handle Authenticated Data
     * This function is used to handle authenticated data to store
     */
    async handleAuthData(user: IAdmin, token: string) {
        // Get auth store from pinia
        const authStore = useAuthStore();
        const userStore = useUserStore();

        // Redirect the user to the home page
        this.router.push("/admin");

        // Show a welcome message to the display_name else username
        this.infoToast(`Welcome ${user.name ?? user.username}`);

        // Set the store data
        userStore.setUser(user);
        authStore.setAccessToken(token);

        // Handle membership update
        const membership = await this.handleMembershipUpdate();
        userStore.setMembership(membership);

        // Reset the user data
        return { user, token };
    }

    /**
     * Handle Membership Update
     * This function is used to handle membership updates
     */
    async handleMembershipUpdate(): Promise<Membership | null> {
        // Get the membership from the database
        const response = await this.axios
            .get("/api/membership", {
                disableErrorToast: true,
                disableInfoToast: true,
            })
            .catch(() => null);

        // Check if the response is successful
        if (response?.status != 200) {
            return null;
        }

        // Get the membership from the response
        return response.data;
    }

    /**
     * Get the current user
     * This method is used to get the current user
     */
    async getCurrentUser() {
        // Send the request to the server to get the current user
        const response = await this.axios.get("/api/auth/me");

        // Check if the response is successful
        if (response.status != 200) {
            this.errorToast(response.data.message || "Failed to get current user, please try again");
            console.error(response.data.message || "Failed to get current user, please try again");
            return;
        }

        // Return the response
        return response.data.user;
    }

    /**
     * Check if the user is authenticated
     * This method is used to check if the user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        // Get auth store from pinia
        const authStore = useAuthStore();

        // Check if the JWT token is expired
        if (!authStore.isAccessTokenExpired()) {
            return true;
        }

        // Refresh the JWT token
        return await this.refreshToken().catch(() => false);
    }

    /**
     * Refresh the JWT token
     * This method is used to refresh the JWT token
     */
    async refreshToken() {
        // Get auth store from pinia
        const authStore = useAuthStore();

        // Check if the access token and refresh token are set
        if (!authStore.token || authStore.token === null) return false;

        // Send the request to the server to refresh the JWT token
        const response = await this.axios.get("/api/auth/refresh", { disableErrorToast: true, refresh_header: true }).catch(() => null);

        // Check if the response is null
        if (response == null || response.status != 200) {
            // this.errorToast("Session expired, please login again");
            // authStore.removeAccessToken();
            return false;
        }

        // Set the new JWT token
        authStore.setAccessToken(response.data.token);

        // Return the response
        return true;
    }

    /**
     * Login to the application
     * This method is used to login the user
     *
     * @param username The username of the user
     * @param password The password of the user
     * @param remember_me Optional parameter to remember the user, defaults to false
     *
     * @returns The response from the server
     */
    async login(username?: string, password?: string, remember_me?: boolean) {
        // Check if the username, password or remember_me are set
        if (username) this.username = username;
        if (password) this.password = password;
        if (remember_me) this.remember_me = remember_me;

        // Check that username, password are set
        if (!this.username || !this.password) {
            this.errorToast("Username or password not provided");
            console.error("Username or password not provided");
            return;
        }

        // Check if remember_me is set, if not set it to false
        if (!this.remember_me) {
            this.remember_me = false;
        }

        // Send the request to the server
        const response = await this.axios.post("/api/auth/login", {
            username: this.username,
            password: this.password,
        });

        // Check if the response is successful
        if (response.status != 200 || !response.data) {
            this.errorToast(response.data.message || "Failed to login, please try again");
            throw new Error(response.data.message || "Failed to login, please try again");
        }

        // Handle the authenticated data
        return this.handleAuthData(response.data.user, response.data.token);
    }

    /**
     * Logout of the application
     * This method is used to logout the user
     *
     * @returns The response from the server
     */
    async logout() {
        // Get auth store from pinia
        const authStore = useAuthStore();
        const userStore = useUserStore();

        // Get the current user username or display_name
        const username = userStore.user?.name ?? userStore.user?.username;

        // Send the request to the server to logout the user
        await this.axios.get("/api/auth/logout", { disableErrorToast: true }).catch(() => console.log("Failed to logout backend"));

        // Remove the auth token and refresh token
        authStore.removeAccessToken();

        try {
            // Redirect the user to the login page
            await this.router.push("/login");
        } catch (e) {
            // If the router push fails, redirect the user to the login page
            window.location.href = "/login";
        }

        // Show a goodbye message to the username else username
        this.infoToast(`Goodbye ${username ?? "User"}`);
    }

    /**
     * Check MFA availability
     * This method is used to check if the user has MFA enabled
     *
     * @returns The boolean value of whether the user has MFA enabled
     */
    async isPasskeyEnabled(username?: string) {
        // Check if the username is set
        if (username) this.username = username;

        // Check if current device supports webauthn
        if (!this.browserSupportsWebAuthn()) {
            return false;
        }

        // Send the request to the server to check if the user has MFA enabled
        const response = await this.axios.post("/api/mfa/available", {
            username: this.username,
        });

        // Check if the response is successful
        if (response.status != 200) {
            return false;
        }

        // Return the boolean value of whether the user has MFA enabled
        return response.data.mfa_available || false;
    }

    /**
     * Handle MFA registration
     * This method is used to handle MFA registration
     */
    async passkeyRegistration(mfaName?: string) {
        // Check if the mfaName is set
        if (mfaName) this.mfaName = mfaName;

        // Make sure the browser supports webauthn
        if (!this.browserSupportsWebAuthn()) {
            this.errorToast("Your browser does not support WebAuthn");
            console.error("Your browser does not support WebAuthn");
            return;
        }

        // Fetch the registration options from the server
        const regResp = await this.axios.get("/api/mfa/registration");

        // Check if the response is successful
        if (regResp.status != 200) {
            this.errorToast(regResp.data.message || "Failed to register, please try again");
            console.error(regResp.data.message || "Failed to register, please try again");
            return;
        }

        // Get the registration options and delete the rp.id
        const registrationOptions = regResp.data;
        delete registrationOptions.rp.id;

        // Create a new registration object
        let registration: RegistrationResponseJSON;

        // Start the registration
        try {
            registration = await startRegistration(regResp.data);
        } catch (e: any) {
            this.errorToast((e as WebAuthnError).message || "Failed to register, please try again");
            console.error((e as WebAuthnError).message || "Failed to register, please try again");
            return;
        }

        // Data to send to the server
        const data = {
            registration: JSON.stringify(registration),
            origin: window.location.origin,
            name: this.mfaName,
        };

        // Send the registration to the server
        const regResp2 = await this.axios.post("/api/mfa/registration", data);

        // Check if the response is successful
        if (regResp2.status != 200) {
            this.errorToast(regResp2.data.message || "Failed to register, please try again");
            console.error(regResp2.data.message || "Failed to register, please try again");
            return;
        }

        // Return the response
        return regResp2;
    }

    /**
     * Handle MFA authentication
     * This method is used to handle MFA authentication
     *
     * @param username The username of the user
     */
    async passkeyAuthentication(username?: string, autofill: boolean = false) {
        // Check if the username is set
        if (username) this.username = username;

        // Make sure the browser supports webauthn
        if (!this.browserSupportsWebAuthn()) {
            throw new Error("Your browser does not support WebAuthn");
        }

        // Make sure the browser supports webauthn autofill
        if (autofill && !(await this.browserSupportsWebAuthnAutofill())) {
            throw new Error("Your browser does not support WebAuthn Autofill");
        }

        // Check if the username is set
        if (!autofill && !this.username) {
            throw new Error("Username not provided");
        }

        // Fetch the authentication options from the server
        const authResp = await this.axios.get("/api/mfa/authentication", {
            params: {
                username: this.username,
            },
        });

        // Check if the response is successful
        if (authResp.status != 200) {
            this.errorToast(authResp.data.message || "Failed to authenticate, please try again");
            throw new Error(authResp.data.message || "Failed to authenticate, please try again");
        }

        // Get the authentication options
        const authenticationOptions = authResp.data;

        // Start the authentication
        const assertion = await startAuthentication(authenticationOptions, autofill).catch(() => {
            // PATCH: Fix error when user cancels MFA authentication
            console.log("Authentication has been cancelled");
        });

        // Check if the assertion is null
        if (!assertion) return;

        // Data to send to the server
        const data = {
            assertion: JSON.stringify(assertion),
            username: this.username,
            origin: window.location.origin,
        };

        // Send the authentication to the server
        const authResp2 = await this.axios.post("/api/mfa/authentication", data).catch((e: any) => {
            this.errorToast(e.data.message || "Failed to authenticate, please try again");
            throw new Error(e.data.message || "Failed to authenticate, please try again");
        });

        // Check if the response is null
        if (!authResp2) return;

        // Handle the authenticated data
        return this.handleAuthData(authResp2.data.auth.user, authResp2.data.auth.token);
    }

    /**
     * MFA de-registration
     * This method is used to remove MFA from the user
     */
    async passkeyDeregistration() {
        // Check if the username is set
        if (!this.username) {
            this.errorToast("Username not provided");
            console.error("Username not provided");
            return;
        }

        // Send the request to the server to remove MFA from the user
        const response = await this.axios.post("/api/mfa/deregistration", {
            username: this.username,
        });

        // Check if the response is successful
        if (response.status != 200) {
            this.errorToast(response.data.message || "Failed to deregister, please try again");
            console.error(response.data.message || "Failed to deregister, please try again");
            return;
        }

        // Return the response
        return response;
    }
}

export default Auth;
