
export const TYPES = new Set();

export const TYPE_USER = "User";
export const TYPE_GRAPH = "Graph";
export const TYPE_VERTEX = "Vertex";

TYPES.add(TYPE_USER);
TYPES.add(TYPE_GRAPH);
TYPES.add(TYPE_VERTEX);

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