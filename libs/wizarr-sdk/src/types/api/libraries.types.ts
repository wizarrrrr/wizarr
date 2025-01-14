import { ListResponse } from "../index.types";
import { Server } from "./server.types";

export type Libraries = Library[];
export type LibraryResponse = ListResponse<Library>;

export interface Library {
    id: string;
    name: string;
    enabled: boolean;
    server?: Server;
}
