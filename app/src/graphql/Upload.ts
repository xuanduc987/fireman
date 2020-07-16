import gql from 'graphql-tag';

import { FileFragment } from './fragments/FileFragment';

export const Upload = gql`
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
  ${FileFragment}
`;
