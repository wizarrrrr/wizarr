import { defineStore } from "pinia";
import type { Servers as IServers, Server as IServer, ServerResponse as IServerResponse } from "@wizarrrr/wizarr-sdk";

export const useServerStore = defineStore("server", {
    state: (): { servers: IServers } => ({
        servers: [],
    }),
    actions: {
        async getServers() {
            // Get servers from API
            const servers = await this.$axios.get<IServerResponse>("/api/servers");

            // Check if the response is valid
            if (!servers?.data?.rows) {
                this.$toast.error("Could not get servers");
                return;
            }

            // Update the servers in the store
            this.servers = servers.data.rows;
        },
        addServer(server: IServer) {
            this.servers.push(server);
        },
        async deleteServer(id: string) {
            // Remove the server from the database
            const response = await this.$axios.delete<IServer>(`/api/servers/${id}`, { disableInfoToast: true }).catch(() => {
                this.$toast.error("Could not delete server");
                return null;
            });

            // Check if the server is null
            if (!response) return;

            const index = this.servers.findIndex((server: IServer) => server.id === id);
            if (index !== -1) this.servers.splice(index, 1);
        },
    },
    getters: {
        getServerById: (state) => (id: string) => {
            return state.servers.find((server: IServer) => server.id === id);
        },
    },
    persist: true,
});
