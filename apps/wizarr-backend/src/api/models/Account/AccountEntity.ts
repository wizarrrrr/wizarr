import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { transformer } from "../transformers/BigIntDate";
import { UserEntity } from "./UserEntity";

@Entity({ name: "accounts" })
export class AccountEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column("text")
    type!: string;

    @Column("text")
    provider!: string;

    @Column("text")
    providerAccountId!: string;

    @Column("text", { nullable: true })
    refresh_token!: string | null;

    @Column("text", { nullable: true })
    access_token!: string | null;

    @Column("bigint", { nullable: true, transformer: transformer.bigint })
    expires_at!: number | null;

    @Column("text", { nullable: true })
    token_type!: string | null;

    @Column("text", { nullable: true })
    scope!: string | null;

    @Column("text", { nullable: true })
    id_token!: string | null;

    @Column("text", { nullable: true })
    session_state!: string | null;

    @Column("text", { nullable: true })
    oauth_token_secret!: string | null;

    @Column("text", { nullable: true })
    oauth_token!: string | null;

    @ManyToOne(() => UserEntity, (user) => user.accounts, {
        createForeignKeyConstraints: true,
    })
    user!: UserEntity;
}
