import DataLoader from 'dataloader';

import { loadDir, loadFile } from './fileApi';


const loadFiles = async (ids: readonly string[]) => {
  return Promise.all(ids.map(loadFile));
};

const loadDirs = async (ids: readonly string[]) => {
  return Promise.all(ids.map(loadDir));
};

export const createContext = () => ({
  fileLoader: new DataLoader(loadFiles),
  dirLoader: new DataLoader(loadDirs),
});

export type Context = ReturnType<typeof createContext>;
