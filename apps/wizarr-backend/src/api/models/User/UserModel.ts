import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Invitation } from "../Invitation/Invitation";
import { DateTimeNow, DateTimeType } from "@/data-source";
import { Server } from "../Server/ServerModel";

@Entity("users")
export class User extends EntityBase {
    @PrimaryColumn()
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

    @Column("text")
    serverId: string;

    @ManyToOne(() => Invitation, (invitation) => invitation.users, { nullable: true })
    invitation: Invitation;

    @CreateDateColumn(DateTimeNow())
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    setServerId() {
        this.serverId = this.server.id;
    }
}
