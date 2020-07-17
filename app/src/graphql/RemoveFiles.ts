import gql from 'graphql-tag';

export const RemoveFiles = gql`
  mutation RemoveFiles($input: RemoveFilesInput!) {
    removeFiles(input: $input) {
      removed
      errors {
        message
        fileId
      }
    }
  }
`;
