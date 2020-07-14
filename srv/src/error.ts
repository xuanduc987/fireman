export const fileExistError = (fileName: string) => ({
  code: "EEXIST" as const,
  fileName,
  message: `File ${fileName} had already existed!`,
});

export const fileNotFoundError = (fileId: string) => ({
  code: "ENOENT" as const,
  fileId,
  message: `File with id ${fileId} not found!`,
});
