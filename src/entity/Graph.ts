import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import { GQLGraph } from '../generated/graphql';
import { User } from "./User";

@Entity()
@Unique("UQ_NAME", ["name", "user"])
export class Graph {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => User, user => user.graphs)
  user: User
}