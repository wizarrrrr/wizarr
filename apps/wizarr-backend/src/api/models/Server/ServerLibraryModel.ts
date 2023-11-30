import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Server } from "./ServerModel";

import { ServerLibrary as IServerLibrary } from "@wizarrrr/wizarr-sdk";

@Entity("server_libraries")
export class ServerLibrary extends EntityBase implements IServerLibrary {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @ManyToOne(() => Server, (server) => server.libraries)
    server: Server;
}
