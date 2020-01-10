import { GQLArcResolvers } from '../generated/graphql';
import { Context, encodeId } from '../utils';
import { TYPE_ARC } from '../Types';
import { User } from '../entity/User';
import { Vertex } from '../entity/Vertex';

export const ArcResolver: GQLArcResolvers = {
  id(parent) {
    return encodeId(parent._id, TYPE_ARC);
  },
  async user(parent, args, context: Context) {
    const userRepo = context.db.manager.getRepository(User);
    const user = await userRepo.findOneOrFail({ where: { id: parent.user._id } });
    return user.toGQL();
  },
  async src(parent, args, context: Context) {
    const vertexRepo = context.db.manager.getRepository(Vertex);
    const vertex = await vertexRepo.findOneOrFail({
      where: {
        id: parent.src._id
      }
    });
    return vertex.toGQL();
  },
  async dst(parent, args, context: Context) {
    const vertexRepo = context.db.manager.getRepository(Vertex);
    const vertex = await vertexRepo.findOneOrFail({
      where: {
        id: parent.dst._id
      }
    });
    return vertex.toGQL();
  }
};


export default ArcResolver;