import { randomBytes } from 'crypto';

import Vector from './vector';

export const getInitializationVector = (): Buffer => {
  return randomBytes(16);
};

export const getInitializationVectorStream = (
  initializationVector: Buffer,
): Vector => {
  return new Vector(initializationVector);
};
