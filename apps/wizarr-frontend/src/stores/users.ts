import { defineStore } from "pinia";
import type { UsersResponse as IUsersResponse, User as IUser, UserStore as UserStoreState } from "@wizarrrrr/wizarr-sdk";

export const useUsersStore = defineStore("users", {
    state: (): UserStoreState => ({
        users: [],
    }),
    actions: {
        async getUsers() {
            // Get the users from the API
            const users = await this.$axios.get<IUsersResponse>("/api/users").catch(() => {
                this.$toast.error("Could not get users");
                return null;
            });

            // If the users are null, return
            if (!users?.data.rows) return;

            // Update the users that are already in the store
            this.users = users.data.rows;

            // Return the users
            return users.data;
        },
        async deleteUser(id: string) {
            // Delete the user from the API
            const response = await this.$axios.delete<IUser>(`/api/users/${id}`, { disableInfoToast: true }).catch(() => {
                this.$toast.error("Could not delete user");
                return null;
            });

            // If the response is null, return
            if (!response) return;

            // Remove the user from the store
            const index = this.users.findIndex((user: IUser) => user.id === id);
            if (index !== -1) this.users.splice(index, 1);
        },
    },
    getters: {},
    persist: true,
});
