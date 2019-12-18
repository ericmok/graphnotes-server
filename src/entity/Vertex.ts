import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from "typeorm";
import { Graph } from "./Graph";
import { User } from "./User";
import { encodeId } from "../utils";
import { TYPE_VERTEX } from "../Types";
import { VertexParent } from "../Types";

@Entity()
export class Vertex {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: true })
  userId: number;

  @ManyToOne(type => User, user => user.graphs)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "int", nullable: true })
  graphId: number;

  @ManyToOne(type => Graph, graph => graph.vertices)
  @JoinColumn({ name: "graphId" })
  graph: Graph;

  @Column()
  content: string;

  @Column("json")
  components: {components: Array<any>};

  toGQL(): VertexParent {
    let retComponents = this.components.components;
    return {
      _id: this.id,
      id: encodeId(this.id, TYPE_VERTEX),
      user: { _id: this.userId },
      graph: { _id: this.graphId },
      components: retComponents,
      content: this.content
    };
  }
}