import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
type PartialId<T> = T extends { id: any } ? Partial<Omit<T, 'id'>> & Pick<T, 'id'> : Partial<T>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type File = FileInfo & {
  __typename?: 'File';
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
  size?: Maybe<Scalars['Int']>;
};

export type FileInfo = {
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
};

export type Folder = FileInfo & {
  __typename?: 'Folder';
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
  children: Array<FileInfo>;
};

export type Query = {
  __typename?: 'Query';
  fileById: FileInfo;
};


export type QueryFileByIdArgs = {
  id: Scalars['ID'];
};




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<PartialId<Scalars['ID']>>;
  FileInfo: ResolversTypes['Folder'] | ResolversTypes['File'];
  DateTime: ResolverTypeWrapper<PartialId<Scalars['DateTime']>>;
  String: ResolverTypeWrapper<PartialId<Scalars['String']>>;
  Folder: ResolverTypeWrapper<PartialId<Folder>>;
  Boolean: ResolverTypeWrapper<PartialId<Scalars['Boolean']>>;
  File: ResolverTypeWrapper<PartialId<File>>;
  Int: ResolverTypeWrapper<PartialId<Scalars['Int']>>;
  CacheControlScope: ResolverTypeWrapper<PartialId<CacheControlScope>>;
  Upload: ResolverTypeWrapper<PartialId<Scalars['Upload']>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: PartialId<Scalars['ID']>;
  FileInfo: ResolversParentTypes['Folder'] | ResolversParentTypes['File'];
  DateTime: PartialId<Scalars['DateTime']>;
  String: PartialId<Scalars['String']>;
  Folder: PartialId<Folder>;
  Boolean: PartialId<Scalars['Boolean']>;
  File: PartialId<File>;
  Int: PartialId<Scalars['Int']>;
  Upload: PartialId<Scalars['Upload']>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modifiedTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['Folder']>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FileInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileInfo'] = ResolversParentTypes['FileInfo']> = {
  __resolveType: TypeResolveFn<'Folder' | 'File', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modifiedTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['Folder']>, ParentType, ContextType>;
};

export type FolderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Folder'] = ResolversParentTypes['Folder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modifiedTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['Folder']>, ParentType, ContextType>;
  children?: Resolver<Array<ResolversTypes['FileInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  fileById?: Resolver<ResolversTypes['FileInfo'], ParentType, ContextType, RequireFields<QueryFileByIdArgs, 'id'>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = Context> = {
  DateTime?: GraphQLScalarType;
  File?: FileResolvers<ContextType>;
  FileInfo?: FileInfoResolvers;
  Folder?: FolderResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;

