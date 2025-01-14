import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { EntityBase } from "../BaseModel";
import { Admin } from "./AdminModel";
import { DateTimeNow } from "../../../data-source";

@Entity("sessions")
export class Session extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { nullable: true })
    ip: string;

    @Column("text", { nullable: true })
    userAgent: string;

    @Column("text", { nullable: true })
    accessJti: string;

    @Column("text", { nullable: true })
    refreshJti: string;

    @ManyToOne(() => Admin, (admin) => admin.sessions)
    user: Admin;

    @Column("text")
    userId: string;

    @CreateDateColumn(DateTimeNow())
    lastUsedAt: Date;

    @CreateDateColumn(DateTimeNow())
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    setAdminId() {
        this.userId = this.user.id;
    }

    @BeforeInsert()
    @BeforeUpdate()
    setLastUsedAt() {
        this.lastUsedAt = new Date();
    }
}
