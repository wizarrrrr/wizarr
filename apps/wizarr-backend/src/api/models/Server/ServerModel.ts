import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "../BaseModel";
import { ServerLibrary } from "./ServerLibraryModel";
import { Admin } from "../Account/AdminModel";

import type { Server as IServer } from "@wizarrrr/wizarr-sdk";
import { DateTimeNow } from "../../../data-source";
import { User } from "../User/UserModel";

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

    @Column("text", { unique: true })
    apiKey: string;

    @OneToMany(() => ServerLibrary, (library) => library.server, { cascade: true, eager: true, nullable: true })
    libraries: ServerLibrary[];

    @OneToMany(() => User, (user) => user.server, { cascade: true, eager: true, nullable: true })
    users: User[];

    @ManyToOne(() => Admin, (admin) => admin.servers, { eager: true })
    admin: Admin;

    @Column("text")
    adminId: string;

    @CreateDateColumn(DateTimeNow())
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    setAdminId() {
        this.adminId = this.admin.id;
    }
}
