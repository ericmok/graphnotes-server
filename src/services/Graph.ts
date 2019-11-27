import { getManager, InsertResult, QueryFailedError } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { encodeId } from '../utils';
import { TYPE_GRAPH } from '../resolvers/Types';
import { Graph } from '../entity/Graph';
import { User } from '../entity/User';

export const GRAPH_UNIQUE_NAME_REQUIRED_MSG = `Graph name must be unique per user`;

export class GraphNameNotUniqueError extends UserInputError {
  constructor() {
    super(GRAPH_UNIQUE_NAME_REQUIRED_MSG);
  }
}

const GraphService = {
  async createGraph(user: User, name?: string) {
    if (!name) {
      name = Math.random().toString();
    }

    const graphRepo = await getManager().getRepository(Graph);

    let result: InsertResult;

    try {
      result = await graphRepo.insert({
        name: name,
        user: user
      });
    }
    catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.message.indexOf('duplicate') !== -1) {
          throw new GraphNameNotUniqueError();
        }
      }
      else {
        console.error(err);
        throw new Error(`Something went wrong creating graph`);
      }
    }

    const id = result.identifiers[0].id;
    const newGraph = await graphRepo.findOne({ id });

    return {
      id: encodeId(id, TYPE_GRAPH),
      name: newGraph.name
    };
  }
};

export default GraphService;