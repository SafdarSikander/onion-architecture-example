import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  content!: string;

  @Column()
  timestamp!: Date;

  @ManyToOne(() => User, (user: User) => user.messages)
  user!: User;
}
