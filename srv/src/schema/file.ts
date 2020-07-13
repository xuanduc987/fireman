import { FileStat } from '../context';

import { Context } from '../context';
import { Resolvers } from '../generated/graphql';

export const typeDef = `
  interface FileInfo {
    id: ID!
    modifiedTime: DateTime!
    name: String!
    path: [Folder!]!
  }

  type File implements FileInfo {
    id: ID!
    modifiedTime: DateTime!
    name: String!
    path: [Folder!]!
    size: Int
  }

  type Folder implements FileInfo {
    id: ID!
    modifiedTime: DateTime!
    name: String!
    path: [Folder!]!
    children: [FileInfo!]!
  }
`;

const filePropResolver = <T extends keyof FileStat>(name: T) => async (
  parent: { id: string },
  _args: any,
  context: Context,
) => {
  let f = await context.fileLoader.load(parent.id);
  return f[name];
};

const common = {
  modifiedTime: filePropResolver('modifiedTime'),
  name: filePropResolver('name'),
  path: filePropResolver('path'),
};

export const resolvers: Resolvers = {
  FileInfo: {
    __resolveType: async ({ id }, context) => {
      let f = await context.fileLoader.load(id);
      return f.kind == 'dir' ? 'Folder' : 'File';
    },
  },
  File: {
    ...common,
    size: filePropResolver('size'),
  },
  Folder: {
    ...common,
    children: async ({ id }, _, { dirLoader }) => {
      return await dirLoader.load(id);
    },
  },
};
