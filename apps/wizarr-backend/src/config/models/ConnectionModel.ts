import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("connection")
export class Connection {
    @PrimaryGeneratedColumn("rowid")
    id: number;

    @Column("text", { unique: true })
    type: string;

    @Column("text", { unique: true })
    host: string;

    @Column("integer", { default: 5432 })
    port: number;

    @Column("text", { unique: true })
    username: string;

    @Column("text", { unique: true })
    password: string;

    @Column("boolean", { default: false })
    ssl: boolean;
}
