const getBaseUrl = (): string => {
  const baseUrl = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

export const withBasePath = (path: string): string => {
  if (!path) return path;

  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const baseUrl = getBaseUrl();
  if (baseUrl !== '/' && path.startsWith(baseUrl)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return baseUrl === '/' ? `/${normalizedPath}` : `${baseUrl}${normalizedPath}`;
};

const isExternalUrl = (path: string): boolean =>
  /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:');

export const resolveImageUrl = (path: string | null, baseUrl: string): string | null => {
  if (!path) return null;

  if (isExternalUrl(path)) {
    return path;
  }

  try {
    return new URL(path, baseUrl).href;
  } catch (error) {
    console.error('Invalid image URL:', { path, baseUrl }, error);
    return null;
  }
};
