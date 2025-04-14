import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { EntityBase } from "../BaseModel";
import { UserEntity } from "./UserEntity";

@Entity("roles")
export class RoleEntity extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { unique: true })
    name: string; // e.g., 'admin', 'moderator', 'user'

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];
}
