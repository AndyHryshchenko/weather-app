const LOCALHOST_ORIGIN_PATTERN = /^http:\/\/localhost:\d+$/;

export const createCorsOriginHandler = (
  clientAppHost: string,
  allowLocalhostPortsInDev: boolean,
): ((
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => void) => {
  const configuredOrigins = clientAppHost
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (configuredOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    if (allowLocalhostPortsInDev && LOCALHOST_ORIGIN_PATTERN.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'), false);
  };
};
