import { getManager, InsertResult, QueryFailedError } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { encodeId, Context, decodeIdOrThrow, NotFoundError } from '../utils';
import { TYPE_GRAPH } from '../Types';
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

    const graphToSave = new Graph();
    graphToSave.name = name;
    graphToSave.user = user;

    try {
      await getManager().getRepository(Graph).save(graphToSave);
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

    return {
      id: encodeId(graphToSave.id, TYPE_GRAPH),
      name: graphToSave.name
    };
  },
  async getGraph(graphId: string, context: Context) {
    const graphRepo = context.db.manager.getRepository(Graph);

    const graph = await graphRepo.findOne({
      relations: ['user'], where: {
        id: decodeIdOrThrow(graphId).id
      }
    });

    if (!graph) {
      throw new NotFoundError('Graph not found');
    }

    const ret = {
      id: encodeId(graph.id, TYPE_GRAPH),
      name: graph.name,
      user: graph.user.toGQL()
    };

    return ret;
  },
  async getGraphsForUser(user: User) {
    // TODO: user validation here?    
    const graphRepo = await getManager().getRepository(Graph);
    const graphs = await graphRepo.find({ where: { user: user }, relations: ["user"] });

    const res = graphs.map(g => ({
      id: encodeId(g.id, TYPE_GRAPH),
      name: g.name.toString(),
      user: g.user.toGQL()
    }));

    return res;
  }
};

export default GraphService;

/*
References:
https://typeorm.io/#/relations-faq/how-to-use-relation-id-without-joining-relation
*/