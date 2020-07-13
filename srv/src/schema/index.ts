import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars';

import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { typeDef as File, resolvers as fileResolvers } from './file';

export const typeDefs = mergeTypeDefs([DateTimeTypeDefinition, File]);

export const resolvers = mergeResolvers([
  fileResolvers as any,
  {
    DateTime: DateTimeResolver,
  },
]);
