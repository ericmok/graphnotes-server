import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, OneToMany } from "typeorm";
import { GQLGraph } from '../generated/graphql';
import { User } from "./User";
import { Vertex } from "./Vertex";

@Entity()
@Unique("UQ_NAME", ["name", "user"])
export class Graph {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => User, user => user.graphs)
  user: User;

  @OneToMany(type => Vertex, vertex => vertex.graph)
  vertices: Vertex[];
}