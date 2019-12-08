import { Connection } from "typeorm";
import { User } from './entity/User';
import { UserInputError, ApolloError } from 'apollo-server';
import { TYPES } from './Types';

export const DEFAULT_SECRET = "h4-98po"
export const APP_SECRET = process.env.APP_SECRET || DEFAULT_SECRET;

if (!process.env.APP_SECRET) {
  console.warn("No APP_SECRET env variable supplied! Remember to provide one in production.");
}

export interface Context {
  appSecret: string,
  request: any,
  db: Connection,
  user?: User
}

export interface IdPayload {
  id: string,
  typename: string
}

export const encodeId = (id: number, typename: string) => {
  return Buffer.from(`${typename}:${id}`).toString('base64');
}

export const decodeIdOrThrow = (ID: string) => {
  const strToDecode = Buffer.from(ID, 'base64').toString('utf-8');
  const colonIndex = strToDecode.indexOf(':');

  if (colonIndex === -1) {
    throw new InvalidIdError();
  }

  const typeName = strToDecode.substring(0, colonIndex);  
  if (!TYPES.has(typeName)) {
    throw new InvalidIdError()
  }

  const id = Number.parseInt(strToDecode.substring(colonIndex + 1, strToDecode.length));
  if (Number.isNaN(id)) {
    throw new InvalidIdError();
  }

  return {
    id,
    typeName
  };
}

export const getTokenFromContext: (context: Context) => string = (context: Context) => {
  const authHeader = context.request.req.headers['authorization'];
  return (authHeader === undefined) ? "" : authHeader;
}

export class NotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, "NOT_FOUND_ERROR");
  }
}

export class InvalidIdError extends UserInputError {
  constructor() {
    super('Invalid id');
  }
}