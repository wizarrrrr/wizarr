import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Admin } from "./AdminModel";

@Entity("roles")
export class Role extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { nullable: false, unique: true })
    name: string;

    @ManyToMany(() => Admin, (user) => user.roles)
    users: Admin[];
}
