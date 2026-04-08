import {
  Cipher,
  createCipheriv,
  createDecipheriv,
  createHash,
  Decipher,
} from 'crypto';

const getCipherKey = (password: string): Uint8Array => {
  return new Uint8Array(createHash('sha256').update(password).digest());
};

export const getCipher = (
  password: string,
  initializationVector: Uint8Array,
): Cipher => {
  return createCipheriv(
    'aes-256-cbc',
    getCipherKey(password),
    initializationVector,
  );
};

export const getDecipher = (
  password: string,
  initializationVector: Uint8Array,
): Decipher => {
  return createDecipheriv(
    'aes-256-cbc',
    getCipherKey(password),
    initializationVector,
  );
};
