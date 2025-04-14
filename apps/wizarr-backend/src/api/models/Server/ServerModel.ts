import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { ServerLibrary } from "./ServerLibraryModel";
import { UserEntity } from "../Account/UserEntity";

import type { Server as IServer } from "@wizarrrrr/wizarr-sdk";
import { DateTimeNow } from "../../../config/connection";
import { User } from "../User/UserModel";
import { Invitation } from "../Invitation/InvitationModel";

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

    @Column("text", { unique: true })
    host: string;

    @Column("text", { nullable: true })
    hostOverride: string;

    @Column("text", { unique: true })
    apiKey: string;

    @OneToMany(() => ServerLibrary, (library) => library.server, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" })
    libraries: ServerLibrary[];

    @OneToMany(() => User, (user) => user.server, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" })
    users: User[];

    @OneToMany(() => Invitation, (invitation) => invitation.server, { nullable: true })
    invitations: Invitation[];

    @ManyToOne(() => UserEntity, (admin) => admin.servers)
    admin: UserEntity;

    @CreateDateColumn(DateTimeNow)
    createdAt: Date;
}
