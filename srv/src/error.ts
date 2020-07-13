export const fileExistError = (fileName: string) => ({
  code: "EEXIST" as const,
  fileName,
  message: `File ${fileName} had already existed!`,
});
