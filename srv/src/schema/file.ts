import { gql } from 'apollo-server';

import path from 'path';

import { Context } from '../context';
import { FileErrorData } from '../error';
import {
  FileStat,
  uploadFiles,
  createFolder,
  removeFiles,
  renameFile,
} from '../fileApi';
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
    url: String!
    size: Int!
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

  type FileExistError {
    message: String!
    fileName: String!
  }

  type FileNotFoundError {
    message: String!
    fileId: ID!
  }

  input UploadFileInput {
    file: Upload!
    name: String!
  }

  input UploadFilesInput {
    parent: ID!
    files: [UploadFileInput!]!
  }

  type UploadFilesPayload {
    files: [FileInfo!]
    errors: [FileExistError!]
  }

  input CreateFolderInput {
    parent: ID!
    name: String!
  }

  type CreateFolderPayload {
    folder: Folder
    error: FileExistError
  }

  input RemoveFilesInput {
    fileIds: [ID!]!
  }

  type RemoveFilesPayload {
    removed: Int!
    errors: [FileNotFoundError!]
  }

  type RenameFileInput {
    fileId: ID!
    name: String!
  }

  input RenameFileInput {
    fileId: ID!
    name: String!
  }

  union FileError = FileNotFoundError | FileExistError

  type RenameFilePayload {
    file: FileInfo
    error: FileError
  }

  type Mutation {
    uploadFiles(input: UploadFilesInput!): UploadFilesPayload!
    createFolder(input: CreateFolderInput!): CreateFolderPayload!
    removeFiles(input: RemoveFilesInput!): RemoveFilesPayload!
    renameFile(input: RenameFileInput!): RenameFilePayload!
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
    url: ({ id = '/' }) => path.join('/files', id),
  },
  Folder: {
    ...common,
    children: async ({ id }, _, { dirLoader }) => {
      return await dirLoader.load(id);
    },
  },
  FileError: {
    __resolveType: (parent: any) => {
      let code = (parent as FileErrorData).code;
      if (code === 'EEXIST') return 'FileExistError';
      if (code === 'ENOENT') return 'FileNotFoundError';
      throw new Error(`Unknown error ${parent}`);
    },
  },
  Query: {
    fileById: (_, { id }) => ({ id: id ? id : '/' }),
  },
  Mutation: {
    uploadFiles: async (_, { input }) => {
      let { files, parent } = input;
      return await uploadFiles(parent, files);
    },
    createFolder: async (_, { input }) => {
      return createFolder(input.parent, input.name);
    },
    removeFiles: async (_, { input }) => {
      return removeFiles(input.fileIds);
    },
    renameFile: async (_, { input }) => {
      return renameFile(input.fileId, input.name);
    },
  },
};
