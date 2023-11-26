import { defineStore } from "pinia";

import type { Membership } from "@/types/api/membership";
import type { Admin } from "@wizarrrr/wizarr-sdk";

interface UserStoreState {
    user: Partial<Admin> | null;
    membership: Membership | null;
}

export const useUserStore = defineStore("user", {
    state: (): UserStoreState => ({
        user: null,
        membership: null,
    }),
    getters: {
        getUser: (state) => {
            return state.user;
        },
    },
    actions: {
        setUser(user: Partial<Admin>) {
            this.user = user;
        },
        updateUser(user: Partial<Admin>) {
            this.user = { ...this.user, ...user };
        },
        setMembership(membership: Membership | null) {
            this.membership = membership;
        },
        updateMembership(membership: Partial<Membership>) {
            this.membership = {
                ...this.membership,
                ...membership,
            } as Membership;
        },
    },
    persist: true,
});
