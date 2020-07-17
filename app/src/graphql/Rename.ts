import gql from 'graphql-tag';

import { FileFragment } from './fragments/FileFragment';

export const Rename = gql`
  mutation Rename($input: RenameFileInput!) {
    renameFile(input: $input) {
      file { ...FileFragment }
      error {
        ... on FileExistError {
          __typename
          message
          fileName
        }
        ... on FileNotFoundError {
          __typename
          message
          fileId
        }
      }
    }
  }
  ${FileFragment}
`;
