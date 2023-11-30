import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { ServerLibrary } from "./ServerLibraryModel";

import type { Server as IServer } from "@wizarrrr/wizarr-sdk";

@Entity("media_servers")
export class Server extends EntityBase implements IServer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("text", { nullable: true })
    description?: string;

    @Column("text")
    type: string;

    @Column("text")
    host: string;

    @Column("text")
    apiKey: string;

    @OneToMany(() => ServerLibrary, (library) => library.server, { cascade: true, eager: true, nullable: true })
    libraries: ServerLibrary[];
}
