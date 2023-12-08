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
            if (!servers?.data) return;

            // If the servers are empty, clear the store and return
            if (servers.data.total_data === 0) {
                this.servers = [];
                return;
            }

            // Update the servers that are already in the store
            this.servers.forEach((server, index) => {
                const new_server = servers.data.rows.find((new_server: IServer) => new_server.id === server.id);
                if (new_server) this.servers[index] = new_server;
            });

            // Add the new servers to the store if they don't exist
            servers.data.rows.forEach((server: IServer) => {
                if (!this.servers.find((old_server) => old_server.id === server.id)) this.servers.push(server);
            });

            // Remove the servers that were not in the response
            this.servers.forEach((server, index) => {
                if (!servers.data.rows.find((new_server: IServer) => new_server.id === server.id)) this.servers.splice(index, 1);
            });

            // Return the servers
            return servers.data;
        },
        addServer(server: IServer) {
            this.servers.push(server);
        },
    },
    persist: true,
});
