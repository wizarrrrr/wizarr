import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityBase } from "@/api/models/BaseModel";

import type { Information as IInformation } from "@wizarrrr/wizarr-sdk";

@Entity("information")
export class Information extends EntityBase implements Partial<IInformation> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("text")
    description: string;

    @Column("boolean")
    bugReporting: boolean;
}
