type AppClientEnv = Pick<
  ImportMetaEnv,
  'VITE_API_BASE_URL' | 'VITE_GOOGLE_MAPS_API_KEY'
>;

export const createAppConstants = (env: AppClientEnv) =>
  ({
    API_BASE_URL: env.VITE_API_BASE_URL ?? 'http://localhost:3001',
    GOOGLE_MAPS_API_KEY: env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    DEBOUNCE_MS: 300,
  }) as const;

export const APP_CONSTANTS = createAppConstants(import.meta.env);
