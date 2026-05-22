import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { locationSlice } from './location/location.slice';
import { settingsSlice } from './settings/settings.slice';
import { weatherApi } from './weather/weather.api';

const rootReducer = combineReducers({
  [weatherApi.reducerPath]: weatherApi.reducer,
  location: locationSlice.reducer,
  settings: settingsSlice.reducer,
});

const createStore = (preloadedState?: Partial<ReturnType<typeof rootReducer>>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(weatherApi.middleware),
    preloadedState,
  });

export const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const setupStore = createStore;
