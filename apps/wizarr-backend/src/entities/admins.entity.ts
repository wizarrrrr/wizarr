import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Roles } from "./roles.entity";
import { hashPassword } from "../utils/password.helper";

@Entity("admins")
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { nullable: false })
    name: string;

    @Column("text", { unique: true, nullable: false })
    username: string;

    @Column("text", { unique: true, nullable: false })
    email: string;

    @Column("text", { nullable: false, select: false })
    password: string;

    @ManyToOne(() => Roles, { nullable: false, cascade: true, eager: true })
    role: Roles;

    @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await hashPassword(this.password);
    }
}
