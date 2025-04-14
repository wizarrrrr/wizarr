import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { EntityBase } from "../BaseModel";
import { UserEntity } from "./UserEntity";
import { DateTimeNow } from "../../../config/connection";
import { transformer } from "../transformers/BigIntDate";

@Entity("sessions")
export class SessionEntity extends EntityBase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { unique: true })
    sessionToken: string;

    @Column("uuid")
    userId: string;

    @Column("text", { nullable: true })
    ip: string;

    @Column("text", { nullable: true })
    userAgent: string;

    @ManyToOne(() => UserEntity, (admin) => admin.sessions)
    user: UserEntity;

    @Column("text", { transformer: transformer.date })
    expires!: string;

    @CreateDateColumn(DateTimeNow)
    createdAt: Date;
}
