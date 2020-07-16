import gql from 'graphql-tag';

export const FileFragment = gql`
  fragment FileFragment on FileInfo {
    __typename
    id
    name
    modifiedTime
    path {
      id
      name
    }
    ... on File {
      size
    }
  }
`;
