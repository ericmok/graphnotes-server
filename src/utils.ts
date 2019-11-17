import { Connection } from "typeorm";

export interface Context {
  request: any,
  db: Connection
}

export const getTokenFromContext: (context: Context) => string = (context: Context) => {
  const authHeader = context.request.req.headers['authorization'];
  return (authHeader === undefined) ? "" : authHeader;
}