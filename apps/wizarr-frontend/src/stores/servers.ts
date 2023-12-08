import { defineStore } from "pinia";
import type { Server as IServer, ServerResponse as IServerResponse } from "@wizarrrr/wizarr-sdk";

export const useServerStore = defineStore("server", {
    state: (): { servers: IServer[] } => ({
        servers: [],
    }),
    actions: {
        async getServers() {
            // Get servers from API
            const servers = await this.$axios.get<IServerResponse>("/api/servers").catch(() => {
                this.$toast.error("Could not get servers");
                return null;
            });

            // If the servers are null, return
            if (!servers?.data.rows) return;

            this.servers = servers.data.rows;

            // Return the servers
            return servers.data;
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
    persist: true,
});
