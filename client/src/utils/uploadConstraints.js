export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export function splitFilesBySize(files = [], maxSize = MAX_FILE_SIZE_BYTES) {
  const accepted = [];
  const rejected = [];

  for (const file of files) {
    if (file.size > maxSize) {
      rejected.push(file);
    } else {
      accepted.push(file);
    }
  }

  return { accepted, rejected };
}
