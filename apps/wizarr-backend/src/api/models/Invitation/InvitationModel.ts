import { BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../User/UserModel";
import { DateTimeNow, DateTimeType } from "../../../config/connection";
import { ServerLibrary } from "../Server/ServerLibraryModel";
import { Admin } from "../Account/AdminModel";
import { Server } from "../Server/ServerModel";

@Entity("invitations")
export class Invitation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { unique: true })
    code: string;

    @ManyToOne(() => Server, (server) => server.invitations)
    server: Server;

    @Column("boolean", { default: false })
    used: boolean;

    @Column("boolean", { default: false })
    unlimited: boolean;

    @ManyToOne(() => User, (user) => user.invitation)
    users: User[];

    @ManyToMany(() => ServerLibrary, (library) => library.invitations)
    libraries: ServerLibrary[];

    @ManyToOne(() => Admin, (admin) => admin.invitations)
    admin: Admin;

    @Column({ type: DateTimeType, nullable: true })
    durationAt: Date;

    @Column({ type: DateTimeType, nullable: true })
    expiresAt: Date;

    @Column({ type: DateTimeType, nullable: true })
    usedAt: Date;

    @CreateDateColumn(DateTimeNow)
    createdAt: Date;

    @BeforeUpdate()
    beforeUpdate() {
        if (this.used) this.usedAt = new Date();
    }
}
