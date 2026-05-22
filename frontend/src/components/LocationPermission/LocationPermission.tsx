import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { LoggerService } from '@/services/LoggerService';
import { useAppDispatch } from '@/store/hooks';
import { setLocationFromGps } from '@/store/location/location.slice';
import { useLazyReverseGeocodeQuery } from '@/store/weather/weather.api';
import {
  GeolocationPermissionState,
  resolveGeolocationPermission,
} from '@/utils/geolocation.utils';
import { getQueryErrorMessage } from '@/utils/weather-query.utils';

const LocationPermissionError = {
  PERMISSION_DENIED: 'permission_denied',
  LOOKUP_FAILED: 'lookup_failed',
};

type LocationPermissionError =
  (typeof LocationPermissionError)[keyof typeof LocationPermissionError];

export function LocationPermission() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [reverseGeocode] = useLazyReverseGeocodeQuery();
  const [error, setError] = useState<LocationPermissionError | null>(null);
  const [lookupErrorMessage, setLookupErrorMessage] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError(LocationPermissionError.PERMISSION_DENIED);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLookupErrorMessage(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const locationInfo = await reverseGeocode({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }).unwrap();
          dispatch(setLocationFromGps(locationInfo));
        } catch (lookupError: unknown) {
          LoggerService.error(
            'Reverse geocode failed after GPS success',
            lookupError instanceof Error ? lookupError : undefined,
          );
          setLookupErrorMessage(
            getQueryErrorMessage(lookupError) ?? t('location.lookupFailed'),
          );
          setError(LocationPermissionError.LOOKUP_FAILED);
        } finally {
          setLoading(false);
        }
      },
      (positionError) => {
        LoggerService.warn('Geolocation request failed', {
          code: positionError.code,
          message: positionError.message,
        });
        setError(LocationPermissionError.PERMISSION_DENIED);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60_000 },
    );
  };

  useEffect(() => {
    void (async () => {
      const permission = await resolveGeolocationPermission();
      if (permission === GeolocationPermissionState.UNSUPPORTED) {
        setError(LocationPermissionError.PERMISSION_DENIED);
        setLoading(false);
        return;
      }
      if (permission === GeolocationPermissionState.DENIED) {
        setError(LocationPermissionError.PERMISSION_DENIED);
        setLoading(false);
        return;
      }
      requestLocation();
    })();
    // Mount-only bootstrap; requestLocation is stable for this flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, []);

  const permissionDeniedMessage =
    error === LocationPermissionError.PERMISSION_DENIED
      ? t('location.permissionDenied')
      : null;

  const hasTwoLineContent = !loading;

  return (
    <div
      className={
        hasTwoLineContent
          ? 'flex flex-col items-center gap-3 rounded-lg border border-border bg-muted p-4 text-center sm:p-5'
          : 'rounded-lg border border-border bg-muted px-4 py-3 text-center'
      }
    >
      {loading ? (
        <p className="text-base font-semibold text-foreground">{t('location.detecting')}</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{t('location.permissionTitle')}</h2>
          <p className="text-sm text-foreground/70">{t('location.permissionDescription')}</p>
        </>
      )}
      {permissionDeniedMessage ? (
        <p className="text-sm text-primary">{permissionDeniedMessage}</p>
      ) : null}
      {lookupErrorMessage ? (
        <RequestErrorAlert message={lookupErrorMessage} />
      ) : null}
    </div>
  );
}
