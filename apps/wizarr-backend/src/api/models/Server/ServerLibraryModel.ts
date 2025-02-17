import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Server } from "./ServerModel";

import { ServerLibrary as IServerLibrary } from "@wizarrrrr/wizarr-sdk";
import { Invitation } from "../Invitation/InvitationModel";

@Entity("server_libraries")
export class ServerLibrary extends EntityBase implements IServerLibrary {
    @PrimaryColumn("text")
    id: string;

    @Column("text")
    name: string;

    @Column("boolean", { default: false })
    enabled: boolean;

    @ManyToMany(() => Invitation, (invitation) => invitation.libraries)
    @JoinTable()
    invitations: Invitation[];

    @ManyToOne(() => Server, (server) => server.libraries)
    server: Server;
}
