import { randomBytes } from 'crypto';

import Vector from './vector';

export const getInitializationVector = (): Uint8Array => {
  return new Uint8Array(randomBytes(16));
};

export const getInitializationVectorStream = (
  initializationVector: Uint8Array,
): Vector => {
  return new Vector(initializationVector);
};
