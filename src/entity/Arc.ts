import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn, OneToOne } from "typeorm";
import { Graph } from "./Graph";
import { User } from "./User";
import { encodeId } from "../utils";
import { TYPE_VERTEX, ArcParent, TYPE_ARC } from "../Types";
import { VertexParent } from "../Types";
import { Vertex } from "./Vertex";

@Entity()
export class Arc {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: true })
  userId: number;

  @ManyToOne(type => User, user => user.graphs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "int", nullable: true })
  srcVertexId: number;

  @OneToOne(type => Vertex)
  srcVertex: Vertex;

  @Column({ type: "int", nullable: true })
  dstVertexId: number;

  @OneToOne(type => Vertex)
  dstVertex: Vertex;

  toGQL(): ArcParent {
    return {
      _id: this.id,
      id: encodeId(this.id, TYPE_ARC),
      user: {
        _id: this.userId
      },
      src: {
        _id: this.srcVertexId
      },
      dst: {
        _id: this.dstVertexId
      }
    };
  }
}