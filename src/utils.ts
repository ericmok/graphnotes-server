import { Connection } from "typeorm";
import { User } from './entity/User';

export interface Context {
  request: any,
  db: Connection,
  user?: User
}

export const getTokenFromContext: (context: Context) => string = (context: Context) => {
  const authHeader = context.request.req.headers['authorization'];
  return (authHeader === undefined) ? "" : authHeader;
}