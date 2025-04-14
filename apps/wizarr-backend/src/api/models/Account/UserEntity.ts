import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany, JoinTable, ValueTransformer } from "typeorm";
import { RoleEntity } from "./RoleEntity";
import { EntityBase } from "../BaseModel";
import { SessionEntity } from "./SessionEntity";
import { DateTimeNow } from "../../../config/connection";
import { Server } from "../Server/ServerModel";
import { Invitation } from "../Invitation/InvitationModel";
import { transformer } from "../transformers/BigIntDate";
import { AccountEntity } from "./AccountEntity";
import { hashPassword } from "../../../utils/password.helper";

@Entity("admins")
export class UserEntity extends EntityBase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { nullable: true })
    name: string | null;

    @Column("text", { unique: true, nullable: false })
    username: string;

    @Column("text", { unique: true, nullable: false })
    email: string;

    @Column("text", { nullable: true, transformer: transformer.date })
    emailVerified: string | null;

    @Column("text", { nullable: true })
    image: string | null;

    @Column("text", { nullable: false })
    password: string;

    @ManyToMany(() => RoleEntity, (role) => role.users)
    @JoinTable({
        name: "user_roles", // Name of the join table
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id",
        },
    })
    roles: RoleEntity[];

    @OneToMany(() => SessionEntity, (session) => session.userId)
    sessions!: SessionEntity[];

    @OneToMany(() => AccountEntity, (account) => account.userId)
    accounts!: AccountEntity[];

    @OneToMany(() => Server, (server) => server.admin)
    servers: Server[];

    @OneToMany(() => Invitation, (invitation) => invitation.admin)
    invitations: Invitation[];

    @Column("boolean", { nullable: false, default: false })
    activated: boolean;

    @CreateDateColumn(DateTimeNow)
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async beforeInsert() {
        this.password = await hashPassword(this.password);
    }
}
