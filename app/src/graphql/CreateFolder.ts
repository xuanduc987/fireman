import gql from 'graphql-tag';

import { FileFragment } from './fragments/FileFragment';

export const CreateFolder = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      folder {
        ...FileFragment
      }
      error {
        message
        fileName
      }
    }
  }
  ${FileFragment}
`;
