import { defineStore } from "pinia";
import type { Libraries as ILibraries, Library as ILibrary, LibraryResponse as ILibraryResponse } from "@wizarrrr/wizarr-sdk";

export const useLibrariesStore = defineStore("libraries", {
    state: (): { libraries: ILibraries } => ({
        libraries: [],
    }),
    actions: {
        async getLibraries() {
            // Get the libraries from the API
            const response = await this.$axios.get<ILibraryResponse>("/api/libraries", {
                params: {
                    relations: "server",
                },
            });

            // Check if the response is valid
            if (!response?.data?.rows) {
                this.$toast.error("Could not get libraries");
                return;
            }

            // Update the libraries in the store
            this.libraries = response.data.rows;
        },
        addLibrary(library: ILibrary) {
            this.libraries.push(library);
        },
        async deleteLibrary(id: string) {
            // Remove the library from the database
            const response = await this.$axios.delete<ILibrary>(`/api/libraries/${id}`, { disableInfoToast: true }).catch(() => {
                this.$toast.error("Could not delete library");
                return null;
            });

            // Check if the library is null
            if (!response) return;

            const index = this.libraries.findIndex((library: ILibrary) => library.id === id);
            if (index !== -1) this.libraries.splice(index, 1);
        },
    },
    getters: {
        getLibraryById: (state) => (id: string) => {
            return state.libraries.find((library: ILibrary) => library.id === id);
        },
        getLibrariesByServerId: (state) => (serverId: string) => {
            return state.libraries.filter((library: ILibrary) => library.server?.id === serverId);
        },
    },
    persist: true,
});
