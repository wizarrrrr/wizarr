import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../User/UserModel";

@Entity("invitations")
export class Invitation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.invitation)
    users: User[];
}
