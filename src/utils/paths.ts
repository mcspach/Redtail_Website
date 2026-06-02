const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

export const withBase = (path: string) => {
  if (!path || path === '/') {
    return import.meta.env.BASE_URL;
  }

  if (
    ABSOLUTE_URL_PATTERN.test(path) ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}`;
};