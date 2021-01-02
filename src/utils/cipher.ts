import {
  Cipher,
  createCipheriv,
  createDecipheriv,
  createHash,
  Decipher,
} from 'crypto';

const getCipherKey = (password: string): Buffer => {
  return createHash('sha256').update(password).digest();
};

export const getCipher = (
  password: string,
  initializationVector: Buffer,
): Cipher => {
  return createCipheriv(
    'aes-256-cbc',
    getCipherKey(password),
    initializationVector,
  );
};

export const getDecipher = (
  password: string,
  initializationVector: Buffer,
): Decipher => {
  return createDecipheriv(
    'aes-256-cbc',
    getCipherKey(password),
    initializationVector,
  );
};
