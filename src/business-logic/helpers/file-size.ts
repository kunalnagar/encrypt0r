import { Stats, statSync } from 'fs';

export const getFileSize = (path: string): Stats => {
  return statSync(path);
};
