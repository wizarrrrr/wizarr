import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Admin } from "./AdminModel";

import type { Role as IRole } from "@wizarrrr/wizarr-sdk";

@Entity("roles")
export class Role extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { nullable: false, unique: true })
    name: string;

    @ManyToMany(() => Admin, (user) => user.roles)
    users: Admin[];
}
