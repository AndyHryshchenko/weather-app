import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { APP_CONSTANTS } from '@/constants/app.constants';
import {
  GooglePlacesService,
  type PlacePrediction,
} from '@/services/GooglePlacesService';
import { LoggerService } from '@/services/LoggerService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocationFromSearch } from '@/store/location/location.slice';
import { selectDisplayName } from '@/store/location/location.selectors';
import { attachPopoverWidthObserver } from '@/utils/location-search.utils';

export function LocationSearch() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const displayName = useAppSelector(selectDisplayName);
  const committedValue = displayName ?? '';
  const inputId = useId();
  const listId = useId();
  const fieldRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(committedValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>();
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const selectedDuringEditRef = useRef(false);
  const inputValue = isEditing ? draftValue : committedValue;

  useLayoutEffect(
    () => attachPopoverWidthObserver(fieldRef.current, setPopoverWidth),
    [],
  );

  useEffect(() => {
    if (!isEditing || !open || !inputValue.trim()) {
      return;
    }
    const timer = setTimeout(() => {
      void GooglePlacesService.getPredictions(inputValue)
        .then((results) => {
          setAutocompleteError(null);
          setPredictions(results);
        })
        .catch((error: unknown) => {
          LoggerService.error(
            'Place autocomplete failed',
            error instanceof Error ? error : undefined,
          );
          setPredictions([]);
          setAutocompleteError(t('location.autocompleteFailed'));
        });
    }, APP_CONSTANTS.DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, open, isEditing, t]);

  const revertToCommittedLocation = () => {
    setDraftValue(committedValue);
    setPredictions([]);
    setAutocompleteError(null);
  };

  const handleFocus = () => {
    setDraftValue((currentDraft) => (isEditing ? currentDraft : committedValue));
    setPredictions([]);
    setAutocompleteError(null);
    setSelectionError(null);
    setIsEditing(true);
    setOpen(true);
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (selectedDuringEditRef.current) {
        selectedDuringEditRef.current = false;
        setIsEditing(false);
        setOpen(false);
        return;
      }
      revertToCommittedLocation();
      setIsEditing(false);
      setOpen(false);
    }, 0);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && isEditing && !selectedDuringEditRef.current) {
      revertToCommittedLocation();
      setIsEditing(false);
    }
  };

  const handleSelect = async (prediction: PlacePrediction) => {
    selectedDuringEditRef.current = true;
    setSelectionError(null);

    try {
      const { query, displayName: resolvedDisplayName } =
        await GooglePlacesService.getPlaceLocation(prediction.placeId);

      if (import.meta.env.DEV) {
        console.log('[LocationSearch] place selected', {
          autocompleteDescription: prediction.description,
          placeId: prediction.placeId,
          locationQuery: query,
          displayName: resolvedDisplayName,
        });
      }

      setDraftValue(resolvedDisplayName);
      dispatch(setLocationFromSearch({ query, displayName: resolvedDisplayName }));
      setOpen(false);
      setIsEditing(false);
      setPredictions([]);
      setAutocompleteError(null);
    } catch (error: unknown) {
      LoggerService.error(
        'Place selection failed',
        error instanceof Error ? error : undefined,
      );
      setSelectionError(t('location.placeResolveFailed'));
      selectedDuringEditRef.current = false;
    }
  };

  const showSuggestionsPanel = open && isEditing && inputValue.trim().length > 0;
  const visibleAutocompleteError = showSuggestionsPanel ? autocompleteError : null;
  const visiblePredictions = showSuggestionsPanel ? predictions : [];

  return (
    <div className="w-full max-w-md space-y-2">
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-foreground"
      >
        {t('location.searchLabel')}
      </label>
      <p className="mb-2 text-xs text-foreground/60">{t('location.searchHint')}</p>
      <Command shouldFilter={false} loop>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverAnchor asChild>
            <div ref={fieldRef} className="w-full">
              <CommandInput
                id={inputId}
                role="combobox"
                aria-expanded={showSuggestionsPanel}
                aria-autocomplete="list"
                aria-controls={showSuggestionsPanel ? listId : undefined}
                autoComplete="off"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('location.searchPlaceholder')}
                value={inputValue}
                onValueChange={(value) => {
                  setDraftValue(value);
                  setAutocompleteError(null);
                  setSelectionError(null);
                  setIsEditing(true);
                  setOpen(true);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </PopoverAnchor>
          {showSuggestionsPanel ? (
            <PopoverContent
              className="p-0"
              align="start"
              sideOffset={4}
              style={popoverWidth ? { width: popoverWidth } : undefined}
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <CommandList id={listId} aria-label={t('location.suggestionsLabel')}>
                {visibleAutocompleteError ? (
                  <div className="px-3 py-2 text-sm text-primary">
                    {visibleAutocompleteError}
                  </div>
                ) : null}
                {!visibleAutocompleteError && visiblePredictions.length === 0 ? (
                  <CommandEmpty>{t('location.noResults')}</CommandEmpty>
                ) : null}
                {visiblePredictions.map((prediction) => (
                  <CommandItem
                    key={prediction.placeId}
                    value={prediction.placeId}
                    keywords={[prediction.description]}
                    onMouseDown={(event) => event.preventDefault()}
                    onSelect={() => void handleSelect(prediction)}
                  >
                    {prediction.description}
                  </CommandItem>
                ))}
              </CommandList>
            </PopoverContent>
          ) : null}
        </Popover>
      </Command>
      {selectionError ? <RequestErrorAlert message={selectionError} /> : null}
    </div>
  );
}
