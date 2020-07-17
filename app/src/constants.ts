export const SERVER_URL =
  import.meta.env.SNOWPACK_PUBLIC_SRV_URL || 'http://localhost:5000';
export const GRAPHQL_URL = SERVER_URL + '/graphql';
