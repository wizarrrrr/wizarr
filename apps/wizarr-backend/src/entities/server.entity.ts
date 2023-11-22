import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;
}
