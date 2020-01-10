
export const TYPES = new Set();

export const TYPE_USER = "User";
export const TYPE_GRAPH = "Graph";
export const TYPE_VERTEX = "Vertex";
export const TYPE_ARC = "Arc";

TYPES.add(TYPE_USER);
TYPES.add(TYPE_GRAPH);
TYPES.add(TYPE_VERTEX);
TYPES.add(TYPE_ARC);

export type GraphParent = Partial<{
  _id: number;
  id: string;
  user: UserParent;
  name: string;
}>

export type UserParent = Partial<{
  _id: number;
  id: string;
  username: string;
  graphs: GraphParent[];
}>

export type VertexParent = Partial<{
  _id: number;
  id: string;
  graph: { _id?: number; };
  user: { _id?: number; };
  content: string;
  components: any;
}>

export type ArcParent = Partial<{
  _id: number;
  id: string;
  user: { _id?: number };
  src: { _id?: number };
  dst: { _id?: number };
}>