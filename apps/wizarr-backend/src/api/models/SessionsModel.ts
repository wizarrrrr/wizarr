import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { EntityBase } from "../../api/models/BaseModel";
import { Admin } from "./AdminModel";

@Entity("sessions")
export class Session extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Admin, (admin) => admin.sessions)
    user: Admin;

    @Column("text", { nullable: true })
    ip: string;

    @Column("text", { nullable: true })
    userAgent: string;

    @Column("text", { nullable: true })
    accessJti: string;

    @Column("text", { nullable: true })
    refreshJti: string;

    @Column("boolean", { default: false })
    revoked: boolean;

    @Column("datetime", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
