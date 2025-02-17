import { createClient } from ".";

export const getUsers = async (server: { host: string; apiKey: string }) => {
    const api = createClient(server.host, server.apiKey);
    return (await (await api).get("/Users")).data;
};

export const getUser = async (server: { host: string; apiKey: string }, id: string) => {
    const api = createClient(server.host, server.apiKey);
    return await (await api).get(`/Users/${id}`);
};
