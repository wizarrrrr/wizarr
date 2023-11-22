import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Roles {
    @PrimaryGeneratedColumn("increment", { type: "integer" })
    id: number;

    @Column("text", { nullable: false, unique: true })
    role: "admin" | "user";
}
