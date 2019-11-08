import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../utils';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  NonBlankString: any,
};









export type GQLAdditionalEntityFields = {
  path?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
};

export type GQLMutation = {
   __typename?: 'Mutation',
  _?: Maybe<Scalars['Boolean']>,
  signup?: Maybe<GQLUser>,
  login?: Maybe<GQLToken>,
};


export type GQLMutationSignupArgs = {
  username: Scalars['NonBlankString'],
  password: Scalars['NonBlankString']
};


export type GQLMutationLoginArgs = {
  username: Scalars['NonBlankString'],
  password: Scalars['NonBlankString']
};


export type GQLQuery = {
   __typename?: 'Query',
  _?: Maybe<Scalars['Boolean']>,
  users: Array<Maybe<GQLUser>>,
};

export type GQLToken = {
   __typename?: 'Token',
  token: Scalars['String'],
};

export type GQLUser = {
   __typename?: 'User',
  username?: Maybe<Scalars['String']>,
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
  User: ResolverTypeWrapper<GQLUser>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Mutation: ResolverTypeWrapper<{}>,
  NonBlankString: ResolverTypeWrapper<Scalars['NonBlankString']>,
  Token: ResolverTypeWrapper<GQLToken>,
  AdditionalEntityFields: GQLAdditionalEntityFields,
};

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = {
  Query: {},
  Boolean: Scalars['Boolean'],
  User: GQLUser,
  String: Scalars['String'],
  Mutation: {},
  NonBlankString: Scalars['NonBlankString'],
  Token: GQLToken,
  AdditionalEntityFields: GQLAdditionalEntityFields,
};

export type GQLUnionDirectiveResolver<Result, Parent, ContextType = Context, Args = {   discriminatorField?: Maybe<Maybe<Scalars['String']>>,
  additionalFields?: Maybe<Maybe<Array<Maybe<GQLAdditionalEntityFields>>>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLAbstractEntityDirectiveResolver<Result, Parent, ContextType = Context, Args = {   discriminatorField?: Maybe<Scalars['String']>,
  additionalFields?: Maybe<Maybe<Array<Maybe<GQLAdditionalEntityFields>>>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLEntityDirectiveResolver<Result, Parent, ContextType = Context, Args = {   embedded?: Maybe<Maybe<Scalars['Boolean']>>,
  additionalFields?: Maybe<Maybe<Array<Maybe<GQLAdditionalEntityFields>>>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLColumnDirectiveResolver<Result, Parent, ContextType = Context, Args = {   overrideType?: Maybe<Maybe<Scalars['String']>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLIdDirectiveResolver<Result, Parent, ContextType = Context, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLLinkDirectiveResolver<Result, Parent, ContextType = Context, Args = {   overrideType?: Maybe<Maybe<Scalars['String']>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLEmbeddedDirectiveResolver<Result, Parent, ContextType = Context, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLMapDirectiveResolver<Result, Parent, ContextType = Context, Args = {   path?: Maybe<Scalars['String']> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GQLMutationResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']> = {
  _?: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>,
  signup?: Resolver<Maybe<GQLResolversTypes['User']>, ParentType, ContextType, RequireFields<GQLMutationSignupArgs, 'username' | 'password'>>,
  login?: Resolver<Maybe<GQLResolversTypes['Token']>, ParentType, ContextType, RequireFields<GQLMutationLoginArgs, 'username' | 'password'>>,
};

export interface GQLNonBlankStringScalarConfig extends GraphQLScalarTypeConfig<GQLResolversTypes['NonBlankString'], any> {
  name: 'NonBlankString'
}

export type GQLQueryResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']> = {
  _?: Resolver<Maybe<GQLResolversTypes['Boolean']>, ParentType, ContextType>,
  users?: Resolver<Array<Maybe<GQLResolversTypes['User']>>, ParentType, ContextType>,
};

export type GQLTokenResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Token'] = GQLResolversParentTypes['Token']> = {
  token?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>,
};

export type GQLUserResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['User'] = GQLResolversParentTypes['User']> = {
  username?: Resolver<Maybe<GQLResolversTypes['String']>, ParentType, ContextType>,
};

export type GQLResolvers<ContextType = Context> = {
  Mutation?: GQLMutationResolvers<ContextType>,
  NonBlankString?: GraphQLScalarType,
  Query?: GQLQueryResolvers<ContextType>,
  Token?: GQLTokenResolvers<ContextType>,
  User?: GQLUserResolvers<ContextType>,
};


export type GQLDirectiveResolvers<ContextType = Context> = {
  union?: GQLUnionDirectiveResolver<any, any, ContextType>,
  abstractEntity?: GQLAbstractEntityDirectiveResolver<any, any, ContextType>,
  entity?: GQLEntityDirectiveResolver<any, any, ContextType>,
  column?: GQLColumnDirectiveResolver<any, any, ContextType>,
  id?: GQLIdDirectiveResolver<any, any, ContextType>,
  link?: GQLLinkDirectiveResolver<any, any, ContextType>,
  embedded?: GQLEmbeddedDirectiveResolver<any, any, ContextType>,
  map?: GQLMapDirectiveResolver<any, any, ContextType>,
};


import { ObjectID } from 'mongodb';
import gql from 'graphql-tag';
