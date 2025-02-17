import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany, JoinTable } from "typeorm";
import { Role } from "./RoleModel";
import { hashPassword } from "../../../utils/password.helper";
import { EntityBase } from "../BaseModel";
import { Session } from "./SessionsModel";
import { DateTimeNow } from "../../../config/connection";
import { Server } from "../Server/ServerModel";
import { Invitation } from "../Invitation/InvitationModel";

@Entity("admins")
export class Admin extends EntityBase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { nullable: false })
    name: string;

    @Column("text", { unique: true, nullable: false })
    username: string;

    @Column("text", { unique: true, nullable: false })
    email: string;

    @Column("text", { nullable: false })
    password: string;

    @ManyToMany(() => Role, null, { eager: true, cascade: true })
    @JoinTable()
    roles: Role[];

    @OneToMany(() => Session, (session) => session.user, { nullable: true, cascade: true })
    sessions: Session[];

    @OneToMany(() => Server, (server) => server.admin, { nullable: true })
    servers: Server[];

    @OneToMany(() => Invitation, (invitation) => invitation.admin, { nullable: true })
    invitations: Invitation[];

    @CreateDateColumn(DateTimeNow)
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await hashPassword(this.password);
    }
}
