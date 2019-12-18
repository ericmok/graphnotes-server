import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserParent, GraphParent, VertexParent } from '../Types';
import { Context } from '../utils';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  JSONObject: any,
  NonBlankString: any,
};


export type GQLArc = GQLNode & {
   __typename?: 'Arc',
  id: Scalars['ID'],
  user: GQLUser,
  src: GQLVertex,
  dst: GQLVertex,
};

export type GQLCreateGraphResult = {
   __typename?: 'CreateGraphResult',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type GQLGraph = GQLNode & {
   __typename?: 'Graph',
  id: Scalars['ID'],
  user: GQLUser,
  name?: Maybe<Scalars['String']>,
  root?: Maybe<GQLVertex>,
  traversalRoot?: Maybe<GQLTraversalVertex>,
  vertices: Array<Maybe<GQLVertex>>,
};


export type GQLMutation = {
   __typename?: 'Mutation',
  _?: Maybe<Scalars['Boolean']>,
  signup?: Maybe<GQLUser>,
  login?: Maybe<GQLToken>,
  createGraph: GQLCreateGraphResult,
  createVertex?: Maybe<GQLVertex>,
};


export type GQLMutationSignupArgs = {
  username: Scalars['NonBlankString'],
  password: Scalars['NonBlankString']
};


export type GQLMutationLoginArgs = {
  username: Scalars['NonBlankString'],
  password: Scalars['NonBlankString']
};


export type GQLMutationCreateGraphArgs = {
  name?: Maybe<Scalars['String']>
};


export type GQLMutationCreateVertexArgs = {
  graphId: Scalars['ID'],
  content: Scalars['String'],
  components?: Maybe<Array<Maybe<Scalars['JSONObject']>>>
};

export type GQLNode = {
  id: Scalars['ID'],
};


export type GQLQuery = {
   __typename?: 'Query',
  _?: Maybe<Scalars['Boolean']>,
  users: Array<Maybe<GQLUser>>,
  me?: Maybe<GQLUser>,
  graph?: Maybe<GQLGraph>,
  vertex?: Maybe<GQLVertex>,
};


export type GQLQueryGraphArgs = {
  id: Scalars['ID']
};


export type GQLQueryVertexArgs = {
  id: Scalars['ID']
};

export type GQLToken = {
   __typename?: 'Token',
  token: Scalars['String'],
};

export type GQLTraversalVertex = GQLNode & {
   __typename?: 'TraversalVertex',
  id: Scalars['ID'],
  parent?: Maybe<GQLTraversalVertex>,
  collapsed: Scalars['Boolean'],
  vertex: GQLVertex,
  children: Array<Maybe<GQLTraversalVertex>>,
};

export type GQLUser = GQLNode & {
   __typename?: 'User',
  id: Scalars['ID'],
  username?: Maybe<Scalars['String']>,
  graphs?: Maybe<Array<Maybe<GQLGraph>>>,
};

export type GQLVertex = GQLNode & {
   __typename?: 'Vertex',
  id: Scalars['ID'],
  user: GQLUser,
  graph: GQLGraph,
  content: Scalars['String'],
  components: Array<Maybe<Scalars['JSONObject']>>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GQLResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  User: ResolverTypeWrapper<UserParent>,
  Node: ResolverTypeWrapper<GQLNode>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Graph: ResolverTypeWrapper<GraphParent>,
  Vertex: ResolverTypeWrapper<VertexParent>,
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>,
  TraversalVertex: ResolverTypeWrapper<Omit<GQLTraversalVertex, 'parent' | 'vertex' | 'children'> & { parent?: Maybe<GQLResolversTypes['TraversalVertex']>, vertex: GQLResolversTypes['Vertex'], children: Array<Maybe<GQLResolversTypes['TraversalVertex']>> }>,
  Mutation: ResolverTypeWrapper<{}>,
  NonBlankString: ResolverTypeWrapper<Scalars['NonBlankString']>,
  Token: ResolverTypeWrapper<GQLToken>,
  CreateGraphResult: ResolverTypeWrapper<GQLCreateGraphResult>,
  Arc: ResolverTypeWrapper<Omit<GQLArc, 'user' | 'src' | 'dst'> & { user: GQLResolversTypes['User'], src: GQLResolversTypes['Vertex'], dst: GQLResolversTypes['Vertex'] }>,
};

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = {
  Query: {},
  Boolean: Scalars['Boolean'],
  User: UserParent,
  Node: GQLNode,
  ID: Scalars['ID'],
  String: Scalars['String'],
  Graph: GraphParent,
  Vertex: VertexParent,
  JSONObject: Scalars['JSONObject'],
  TraversalVertex: Omit<GQLTraversalVertex, 'parent' | 'vertex' | 'children'> & { parent?: Maybe<GQLResolversParentTypes['TraversalVertex']>, vertex: GQLResolversParentTypes['Vertex'], children: Array<Maybe<GQLResolversParentTypes['TraversalVertex']>> },
  Mutation: {},
  NonBlankString: Scalars['NonBlankString'],
  Token: GQLToken,
  CreateGraphResult: GQLCreateGraphResult,
  Arc: Omit<GQLArc, 'user' | 'src' | 'dst'> & { user: GQLResolversParentTypes['User'], src: GQLResolversParentTypes['Vertex'], dst: GQLResolversParentTypes['Vertex'] },
};

export type GQLRequiresAuthDirectiveResolver<Result, Parent, ContextType = Context, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLArcResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Arc'] = GQLResolversParentTypes['Arc']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
  user?: Resolver<GQLResolversTypes['User'], ParentType, ContextType>,
  src?: Resolver<GQLResolversTypes['Vertex'], ParentType, ContextType>,
  dst?: Resolver<GQLResolversTypes['Vertex'], ParentType, ContextType>,
};

export type GQLCreateGraphResultResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['CreateGraphResult'] = GQLResolversParentTypes['CreateGraphResult']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>,
};

export type GQLGraphResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Graph'] = GQLResolversParentTypes['Graph']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
  user?: Resolver<GQLResolversTypes['User'], ParentType, ContextType>,
  name?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>,
  root?: Resolver<Maybe<GQLResolversTypes['Vertex']>, ParentType, ContextType>,
  traversalRoot?: Resolver<Maybe<GQLResolversTypes['TraversalVertex']>, ParentType, ContextType>,
  vertices?: Resolver<Array<Maybe<GQLResolversTypes['Vertex']>>, ParentType, ContextType>,
};

export interface GQLJsonObjectScalarConfig extends GraphQLScalarTypeConfig<GQLResolversTypes['JSONObject'], any> {
  name: 'JSONObject'
}

export type GQLMutationResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']> = {
  _?: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>,
  signup?: Resolver<Maybe<GQLResolversTypes['User']>, ParentType, ContextType, RequireFields<GQLMutationSignupArgs, 'username' | 'password'>>,
  login?: Resolver<Maybe<GQLResolversTypes['Token']>, ParentType, ContextType, RequireFields<GQLMutationLoginArgs, 'username' | 'password'>>,
  createGraph?: Resolver<GQLResolversTypes['CreateGraphResult'], ParentType, ContextType, GQLMutationCreateGraphArgs>,
  createVertex?: Resolver<Maybe<GQLResolversTypes['Vertex']>, ParentType, ContextType, RequireFields<GQLMutationCreateVertexArgs, 'graphId' | 'content'>>,
};

export type GQLNodeResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Node'] = GQLResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'User' | 'Graph' | 'Vertex' | 'TraversalVertex' | 'Arc', ParentType, ContextType>,
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
};

export interface GQLNonBlankStringScalarConfig extends GraphQLScalarTypeConfig<GQLResolversTypes['NonBlankString'], any> {
  name: 'NonBlankString'
}

export type GQLQueryResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']> = {
  _?: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>,
  users?: Resolver<Array<Maybe<GQLResolversTypes['User']>>, ParentType, ContextType>,
  me?: Resolver<Maybe<GQLResolversTypes['User']>, ParentType, ContextType>,
  graph?: Resolver<Maybe<GQLResolversTypes['Graph']>, ParentType, ContextType, RequireFields<GQLQueryGraphArgs, 'id'>>,
  vertex?: Resolver<Maybe<GQLResolversTypes['Vertex']>, ParentType, ContextType, RequireFields<GQLQueryVertexArgs, 'id'>>,
};

export type GQLTokenResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Token'] = GQLResolversParentTypes['Token']> = {
  token?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>,
};

export type GQLTraversalVertexResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['TraversalVertex'] = GQLResolversParentTypes['TraversalVertex']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
  parent?: Resolver<Maybe<GQLResolversTypes['TraversalVertex']>, ParentType, ContextType>,
  collapsed?: Resolver<GQLResolversTypes['Boolean'], ParentType, ContextType>,
  vertex?: Resolver<GQLResolversTypes['Vertex'], ParentType, ContextType>,
  children?: Resolver<Array<Maybe<GQLResolversTypes['TraversalVertex']>>, ParentType, ContextType>,
};

export type GQLUserResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['User'] = GQLResolversParentTypes['User']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
  username?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>,
  graphs?: Resolver<Maybe<Array<Maybe<GQLResolversTypes['Graph']>>>, ParentType, ContextType>,
};

export type GQLVertexResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Vertex'] = GQLResolversParentTypes['Vertex']> = {
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>,
  user?: Resolver<GQLResolversTypes['User'], ParentType, ContextType>,
  graph?: Resolver<GQLResolversTypes['Graph'], ParentType, ContextType>,
  content?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>,
  components?: Resolver<Array<Maybe<GQLResolversTypes['JSONObject']>>, ParentType, ContextType>,
};

export type GQLResolvers<ContextType = Context> = {
  Arc?: GQLArcResolvers<ContextType>,
  CreateGraphResult?: GQLCreateGraphResultResolvers<ContextType>,
  Graph?: GQLGraphResolvers<ContextType>,
  JSONObject?: GraphQLScalarType,
  Mutation?: GQLMutationResolvers<ContextType>,
  Node?: GQLNodeResolvers,
  NonBlankString?: GraphQLScalarType,
  Query?: GQLQueryResolvers<ContextType>,
  Token?: GQLTokenResolvers<ContextType>,
  TraversalVertex?: GQLTraversalVertexResolvers<ContextType>,
  User?: GQLUserResolvers<ContextType>,
  Vertex?: GQLVertexResolvers<ContextType>,
};


export type GQLDirectiveResolvers<ContextType = Context> = {
  requiresAuth?: GQLRequiresAuthDirectiveResolver<any, any, ContextType>,
};


import gql from 'graphql-tag';
