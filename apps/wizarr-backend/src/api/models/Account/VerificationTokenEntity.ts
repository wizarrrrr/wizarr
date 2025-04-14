import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { transformer } from "../transformers/BigIntDate";

@Entity({ name: "verification_tokens" })
export class VerificationTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("text")
    token!: string;

    @Column("text")
    identifier!: string;

    @Column("text", { transformer: transformer.date })
    expires!: string;
}
