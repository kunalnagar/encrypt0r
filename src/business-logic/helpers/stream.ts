import {
  createReadStream,
  createWriteStream,
  ReadStream,
  WriteStream,
} from 'fs';

export const getSourceStream = (
  path: string,
  start?: number,
  end?: number,
): ReadStream => {
  return createReadStream(path, {
    start,
    end,
  });
};

export const getDestinationStream = (path: string): WriteStream => {
  return createWriteStream(path);
};
