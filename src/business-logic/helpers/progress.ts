export const calculateProgress = (
  chunkSize: number,
  totalSize: number,
): number => {
  return Math.floor((chunkSize / totalSize) * 100);
};
