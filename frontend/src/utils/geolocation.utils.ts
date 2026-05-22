export const GeolocationPermissionState = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PROMPT: 'prompt',
  UNSUPPORTED: 'unsupported',
};

export type GeolocationPermissionState =
  (typeof GeolocationPermissionState)[keyof typeof GeolocationPermissionState];

export const resolveGeolocationPermission = async (): Promise<GeolocationPermissionState> => {
  if (!navigator.geolocation) {
    return GeolocationPermissionState.UNSUPPORTED;
  }
  if (!navigator.permissions?.query) {
    return GeolocationPermissionState.PROMPT;
  }
  try {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    if (status.state === GeolocationPermissionState.GRANTED) {
      return GeolocationPermissionState.GRANTED;
    }
    if (status.state === GeolocationPermissionState.DENIED) {
      return GeolocationPermissionState.DENIED;
    }
    return GeolocationPermissionState.PROMPT;
  } catch {
    return GeolocationPermissionState.PROMPT;
  }
};
