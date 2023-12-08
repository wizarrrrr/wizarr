import { defineStore } from "pinia";
import type { UsersResponse as IUsersResponse, User as IUser, UserStore as UserStoreState } from "@wizarrrr/wizarr-sdk";

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
            if (users === null) return;

            // Update the users that are already in the store
            this.users.forEach((user, index) => {
                const new_user = users.data.rows.find((new_user: IUser) => new_user.id === user.id);
                if (new_user) this.users[index] = new_user;
            });

            // Add the new users to the store if they don't exist
            users.data.rows.forEach((user: IUser) => {
                if (!this.users.find((old_user) => old_user.id === user.id)) this.users.push(user);
            });

            // Remove the users that were not in the response
            this.users.forEach((user, index) => {
                if (!users.data.rows.find((new_user: IUser) => new_user.id === user.id)) this.users.splice(index, 1);
            });

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
            if (response === null) return;

            // Remove the user from the store
            const index = this.users.findIndex((user: IUser) => user.id === id);
            if (index !== -1) this.users.splice(index, 1);
        },
    },
    getters: {},
    persist: true,
});
