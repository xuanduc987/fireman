import gql from 'graphql-tag';

export const FileFragment = gql`
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
