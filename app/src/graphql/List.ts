import gql from 'graphql-tag';

import { FileFragment } from './fragments/FileFragment';

export const List = gql`
  query List($dir: ID!) {
    fileById(id: $dir) {
      __typename
      id
      name
      ...FileFragment
      ... on Folder {
        children { ...FileFragment }
      }
    }
  }
  ${FileFragment}
`;
