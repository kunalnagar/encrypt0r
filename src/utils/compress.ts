import { createGunzip, createGzip, Gunzip, Gzip } from 'zlib';

export const compress = (): Gzip => {
  return createGzip();
};

export const decompress = (): Gunzip => {
  return createGunzip();
};
