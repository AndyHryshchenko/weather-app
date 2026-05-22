import { TemperatureUnit } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnits } from '@/store/settings/settings.slice';
import { selectUnits } from '@/store/settings/settings.selectors';

export function UnitToggle() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const units = useAppSelector(selectUnits);

  return (
    <div className="flex gap-1 rounded-md border border-border p-1">
      <Button
        variant={units === TemperatureUnit.METRIC ? 'default' : 'ghost'}
        size="sm"
        onClick={() => dispatch(setUnits(TemperatureUnit.METRIC))}
      >
        {t('units.metric')}
      </Button>
      <Button
        variant={units === TemperatureUnit.IMPERIAL ? 'default' : 'ghost'}
        size="sm"
        onClick={() => dispatch(setUnits(TemperatureUnit.IMPERIAL))}
      >
        {t('units.imperial')}
      </Button>
    </div>
  );
}
