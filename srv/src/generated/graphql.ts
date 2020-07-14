import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
export type DeepPartial<T> = T extends Function ? T : (T extends object ? T extends { id: any } ? { [P in keyof Omit<T, 'id'>]?: DeepPartial<T[P]>; } & Pick<T, 'id'> : { [P in keyof T]?: DeepPartial<T[P]>; } : T);
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

export type CreateFolderInput = {
  parent: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateFolderPayload = {
  __typename?: 'CreateFolderPayload';
  folder?: Maybe<Folder>;
  error?: Maybe<FileExistError>;
};


export type File = FileInfo & {
  __typename?: 'File';
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
  size?: Maybe<Scalars['Int']>;
};

export type FileExistError = {
  __typename?: 'FileExistError';
  message: Scalars['String'];
  fileName: Scalars['String'];
};

export type FileInfo = {
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
};

export type FileNotFoundError = {
  __typename?: 'FileNotFoundError';
  message: Scalars['String'];
  fileId: Scalars['ID'];
};

export type Folder = FileInfo & {
  __typename?: 'Folder';
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
  children: Array<FileInfo>;
};

export type Mutation = {
  __typename?: 'Mutation';
  uploadFiles: UploadFilesPayload;
  createFolder: CreateFolderPayload;
  removeFiles: RemoveFilesPayload;
};


export type MutationUploadFilesArgs = {
  input: UploadFilesInput;
};


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};


export type MutationRemoveFilesArgs = {
  input: RemoveFilesInput;
};

export type Query = {
  __typename?: 'Query';
  fileById: FileInfo;
};


export type QueryFileByIdArgs = {
  id: Scalars['ID'];
};

export type RemoveFilesInput = {
  fileIds: Array<Scalars['ID']>;
};

export type RemoveFilesPayload = {
  __typename?: 'RemoveFilesPayload';
  removed: Scalars['Int'];
  errors?: Maybe<Array<FileNotFoundError>>;
};


export type UploadFileInput = {
  file: Scalars['Upload'];
  name: Scalars['String'];
};

export type UploadFilesInput = {
  parent: Scalars['ID'];
  files: Array<UploadFileInput>;
};

export type UploadFilesPayload = {
  __typename?: 'UploadFilesPayload';
  files?: Maybe<Array<FileInfo>>;
  errors?: Maybe<Array<FileExistError>>;
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
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']>>;
  FileInfo: ResolversTypes['Folder'] | ResolversTypes['File'];
  DateTime: ResolverTypeWrapper<DeepPartial<Scalars['DateTime']>>;
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']>>;
  Folder: ResolverTypeWrapper<DeepPartial<Folder>>;
  Mutation: ResolverTypeWrapper<{}>;
  UploadFilesInput: ResolverTypeWrapper<DeepPartial<UploadFilesInput>>;
  UploadFileInput: ResolverTypeWrapper<DeepPartial<UploadFileInput>>;
  Upload: ResolverTypeWrapper<DeepPartial<Scalars['Upload']>>;
  UploadFilesPayload: ResolverTypeWrapper<DeepPartial<UploadFilesPayload>>;
  FileExistError: ResolverTypeWrapper<DeepPartial<FileExistError>>;
  CreateFolderInput: ResolverTypeWrapper<DeepPartial<CreateFolderInput>>;
  CreateFolderPayload: ResolverTypeWrapper<DeepPartial<CreateFolderPayload>>;
  RemoveFilesInput: ResolverTypeWrapper<DeepPartial<RemoveFilesInput>>;
  RemoveFilesPayload: ResolverTypeWrapper<DeepPartial<RemoveFilesPayload>>;
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']>>;
  FileNotFoundError: ResolverTypeWrapper<DeepPartial<FileNotFoundError>>;
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']>>;
  File: ResolverTypeWrapper<DeepPartial<File>>;
  CacheControlScope: ResolverTypeWrapper<DeepPartial<CacheControlScope>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: DeepPartial<Scalars['ID']>;
  FileInfo: ResolversParentTypes['Folder'] | ResolversParentTypes['File'];
  DateTime: DeepPartial<Scalars['DateTime']>;
  String: DeepPartial<Scalars['String']>;
  Folder: DeepPartial<Folder>;
  Mutation: {};
  UploadFilesInput: DeepPartial<UploadFilesInput>;
  UploadFileInput: DeepPartial<UploadFileInput>;
  Upload: DeepPartial<Scalars['Upload']>;
  UploadFilesPayload: DeepPartial<UploadFilesPayload>;
  FileExistError: DeepPartial<FileExistError>;
  CreateFolderInput: DeepPartial<CreateFolderInput>;
  CreateFolderPayload: DeepPartial<CreateFolderPayload>;
  RemoveFilesInput: DeepPartial<RemoveFilesInput>;
  RemoveFilesPayload: DeepPartial<RemoveFilesPayload>;
  Int: DeepPartial<Scalars['Int']>;
  FileNotFoundError: DeepPartial<FileNotFoundError>;
  Boolean: DeepPartial<Scalars['Boolean']>;
  File: DeepPartial<File>;
};

export type CreateFolderPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateFolderPayload'] = ResolversParentTypes['CreateFolderPayload']> = {
  folder?: Resolver<Maybe<ResolversTypes['Folder']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['FileExistError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
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

export type FileExistErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileExistError'] = ResolversParentTypes['FileExistError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FileInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileInfo'] = ResolversParentTypes['FileInfo']> = {
  __resolveType: TypeResolveFn<'Folder' | 'File', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modifiedTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['Folder']>, ParentType, ContextType>;
};

export type FileNotFoundErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileNotFoundError'] = ResolversParentTypes['FileNotFoundError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FolderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Folder'] = ResolversParentTypes['Folder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modifiedTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['Folder']>, ParentType, ContextType>;
  children?: Resolver<Array<ResolversTypes['FileInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  uploadFiles?: Resolver<ResolversTypes['UploadFilesPayload'], ParentType, ContextType, RequireFields<MutationUploadFilesArgs, 'input'>>;
  createFolder?: Resolver<ResolversTypes['CreateFolderPayload'], ParentType, ContextType, RequireFields<MutationCreateFolderArgs, 'input'>>;
  removeFiles?: Resolver<ResolversTypes['RemoveFilesPayload'], ParentType, ContextType, RequireFields<MutationRemoveFilesArgs, 'input'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  fileById?: Resolver<ResolversTypes['FileInfo'], ParentType, ContextType, RequireFields<QueryFileByIdArgs, 'id'>>;
};

export type RemoveFilesPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveFilesPayload'] = ResolversParentTypes['RemoveFilesPayload']> = {
  removed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['FileNotFoundError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UploadFilesPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UploadFilesPayload'] = ResolversParentTypes['UploadFilesPayload']> = {
  files?: Resolver<Maybe<Array<ResolversTypes['FileInfo']>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['FileExistError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = Context> = {
  CreateFolderPayload?: CreateFolderPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  File?: FileResolvers<ContextType>;
  FileExistError?: FileExistErrorResolvers<ContextType>;
  FileInfo?: FileInfoResolvers;
  FileNotFoundError?: FileNotFoundErrorResolvers<ContextType>;
  Folder?: FolderResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RemoveFilesPayload?: RemoveFilesPayloadResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadFilesPayload?: UploadFilesPayloadResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;

