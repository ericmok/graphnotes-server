import { Connection } from "typeorm";

export interface Context {
  request: any,
  db: Connection
}