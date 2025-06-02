// utils/imageUtils.ts
export const buildFullImageUrl = (relativePath: string, baseApiUrl: string) => {
  if (relativePath.startsWith("/uploads")) {
    const BASE_SERVER_URL = baseApiUrl.replace("/api", "");
    return `${BASE_SERVER_URL}${relativePath}`;
  }
  return relativePath;
};