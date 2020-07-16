import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type Query = {
  __typename?: 'Query';
  fileById: FileInfo;
};


export type QueryFileByIdArgs = {
  id: Scalars['ID'];
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

export type UploadFilesInput = {
  parent: Scalars['ID'];
  files: Array<UploadFileInput>;
};

export type UploadFileInput = {
  file: Scalars['Upload'];
  name: Scalars['String'];
};


export type UploadFilesPayload = {
  __typename?: 'UploadFilesPayload';
  files?: Maybe<Array<FileInfo>>;
  errors?: Maybe<Array<FileExistError>>;
};

export type FileExistError = {
  __typename?: 'FileExistError';
  message: Scalars['String'];
  fileName: Scalars['String'];
};

export type CreateFolderInput = {
  parent: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateFolderPayload = {
  __typename?: 'CreateFolderPayload';
  folder?: Maybe<Folder>;
  error?: Maybe<FileExistError>;
};

export type RemoveFilesInput = {
  fileIds: Array<Scalars['ID']>;
};

export type RemoveFilesPayload = {
  __typename?: 'RemoveFilesPayload';
  removed: Scalars['Int'];
  errors?: Maybe<Array<FileNotFoundError>>;
};

export type FileNotFoundError = {
  __typename?: 'FileNotFoundError';
  message: Scalars['String'];
  fileId: Scalars['ID'];
};

export type File = FileInfo & {
  __typename?: 'File';
  id: Scalars['ID'];
  modifiedTime: Scalars['DateTime'];
  name: Scalars['String'];
  path: Array<Folder>;
  size: Scalars['Int'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type ListQueryVariables = Exact<{
  dir: Scalars['ID'];
}>;


export type ListQuery = (
  { __typename?: 'Query' }
  & { fileById: (
    { __typename: 'Folder' }
    & Pick<Folder, 'id' | 'name'>
    & { children: Array<(
      { __typename?: 'Folder' }
      & FileFragment_Folder_Fragment
    ) | (
      { __typename?: 'File' }
      & FileFragment_File_Fragment
    )> }
    & FileFragment_Folder_Fragment
  ) | (
    { __typename: 'File' }
    & Pick<File, 'id' | 'name'>
    & FileFragment_File_Fragment
  ) }
);

export type UploadMutationVariables = Exact<{
  input: UploadFilesInput;
}>;


export type UploadMutation = (
  { __typename?: 'Mutation' }
  & { uploadFiles: (
    { __typename?: 'UploadFilesPayload' }
    & { files?: Maybe<Array<(
      { __typename?: 'Folder' }
      & FileFragment_Folder_Fragment
    ) | (
      { __typename?: 'File' }
      & FileFragment_File_Fragment
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FileExistError' }
      & Pick<FileExistError, 'fileName' | 'message'>
    )>> }
  ) }
);

type FileFragment_Folder_Fragment = (
  { __typename: 'Folder' }
  & Pick<Folder, 'id' | 'name' | 'modifiedTime'>
);

type FileFragment_File_Fragment = (
  { __typename: 'File' }
  & Pick<File, 'size' | 'id' | 'name' | 'modifiedTime'>
);

export type FileFragmentFragment = FileFragment_Folder_Fragment | FileFragment_File_Fragment;

export const FileFragmentFragmentDoc = gql`
    fragment FileFragment on FileInfo {
  __typename
  id
  name
  modifiedTime
  ... on File {
    size
  }
}
    `;
export const ListDocument = gql`
    query List($dir: ID!) {
  fileById(id: $dir) {
    __typename
    id
    name
    ...FileFragment
    ... on Folder {
      children {
        ...FileFragment
      }
    }
  }
}
    ${FileFragmentFragmentDoc}`;

export function useListQuery(options: Omit<Urql.UseQueryArgs<ListQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ListQuery>({ query: ListDocument, ...options });
};
export const UploadDocument = gql`
    mutation Upload($input: UploadFilesInput!) {
  uploadFiles(input: $input) {
    files {
      ...FileFragment
    }
    errors {
      fileName
      message
    }
  }
}
    ${FileFragmentFragmentDoc}`;

export function useUploadMutation() {
  return Urql.useMutation<UploadMutation, UploadMutationVariables>(UploadDocument);
};