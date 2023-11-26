import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "@/api/models/BaseModel";

import type { Server as IServer } from "@wizarrrr/wizarr-sdk";

@Entity("server")
export class Server extends EntityBase implements Partial<IServer> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;
}
