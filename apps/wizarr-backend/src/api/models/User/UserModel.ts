import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Invitation } from "../Invitation/InvitationModel";
import { DateTimeNow, DateTimeType } from "../../../data-source";
import { Server } from "../Server/ServerModel";

@Entity("users")
export class User extends EntityBase {
    @PrimaryColumn("text")
    id: string;

    @Column("text", { nullable: true })
    name: string;

    @Column("text", { nullable: true })
    avatar: string;

    @Column("text", { nullable: true })
    username: string;

    @Column("text", { nullable: true })
    email: string;

    @Column({ type: DateTimeType, nullable: true, default: null })
    expiresAt: Date | null;

    @ManyToOne(() => Server, (server) => server.users)
    server: Server;

    @ManyToOne(() => Invitation, (invitation) => invitation.users, { nullable: true })
    invitation: Invitation;

    @Column({ type: DateTimeType, nullable: true })
    lastLoginAt: Date | null;

    @Column({ type: DateTimeType, nullable: true })
    lastActivityAt: Date | null;

    @CreateDateColumn(DateTimeNow())
    createdAt: Date;
}
