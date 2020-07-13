import { gql } from 'apollo-server';

import { ReadStream } from 'fs';

import { Context } from '../context';
import { FileStat, uploadFile } from '../fileApi';
import { Resolvers } from '../generated/graphql';

export const typeDef = gql`
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

  type Query {
    fileById(id: ID!): FileInfo!
  }

  input UploadFileInput {
    name: String!
    parent: ID!
    file: Upload!
  }

  type Mutation {
    uploadFile(input: UploadFileInput!): FileInfo!
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
  Query: {
    fileById: (_, { id }) => ({ id: id ? id : '/' }),
  },
  Mutation: {
    uploadFile: async (_, { input }) => {
      let { file, name, parent } = input
      let { createReadStream } = await file;
      let stream: ReadStream = createReadStream();
      return await uploadFile(parent, name, stream)
    },
  },
};
