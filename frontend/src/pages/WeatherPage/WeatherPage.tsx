import { useTranslation } from 'react-i18next';
import { LocationPermission } from '@/components/LocationPermission/LocationPermission';
import { LocationSearch } from '@/components/LocationSearch/LocationSearch';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { UnitToggle } from '@/components/UnitToggle/UnitToggle';
import { WeatherTabs } from '@/components/WeatherTabs/WeatherTabs';
import { WEATHER_REQUEST_LABEL_KEYS } from '@/constants/weather-request.constants';
import { useAppSelector } from '@/store/hooks';
import { selectDisplayName, selectLocationQuery } from '@/store/location/location.selectors';
import { selectUnits } from '@/store/settings/settings.selectors';
import { useWeatherForLocation } from '@/store/weather/useWeatherQueries';

export function WeatherPage() {
  const { t } = useTranslation();
  const locationQuery = useAppSelector(selectLocationQuery);
  const displayName = useAppSelector(selectDisplayName);
  const units = useAppSelector(selectUnits);
  const {
    current,
    hourly,
    forecast,
    currentStatus,
    hourlyStatus,
    forecastStatus,
    errors,
    currentError,
    hourlyError,
    forecastError,
  } = useWeatherForLocation(locationQuery, units);

  return (
    <div className="mx-auto flex min-h-screen w-full min-w-0 max-w-4xl flex-col gap-6 overflow-x-hidden p-4 md:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('app.title')}</h1>
          {displayName ? (
            <p className="text-foreground/70">
              {t('app.weatherIn', { location: displayName })}
            </p>
          ) : null}
        </div>
        <UnitToggle />
      </header>

      <LocationSearch />

      {!locationQuery ? <LocationPermission /> : null}

      {errors.length > 0 ? (
        <div className="space-y-2" role="alert">
          <p className="text-sm font-medium text-primary">{t('error.loadFailed')}</p>
          <ul className="space-y-2">
            {errors.map((entry) => (
              <li key={entry.request}>
                <RequestErrorAlert
                  title={t(WEATHER_REQUEST_LABEL_KEYS[entry.request])}
                  message={entry.message}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {locationQuery ? (
        <WeatherTabs
          current={current}
          hourly={hourly}
          forecast={forecast}
          units={units}
          currentStatus={currentStatus}
          hourlyStatus={hourlyStatus}
          forecastStatus={forecastStatus}
          currentError={currentError}
          hourlyError={hourlyError}
          forecastError={forecastError}
        />
      ) : null}
    </div>
  );
}
