import { AsyncStatus } from '@weather-app/types';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { WeatherRequestKind } from '@/constants/weather-request.constants';

interface QueryStatusInput {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export interface WeatherQueryErrorDetail {
  request: WeatherRequestKind;
  message: string;
}

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid location or request parameters.',
  404: 'Location or weather data was not found.',
  502: 'Weather provider returned an invalid response.',
  503: 'Weather service is temporarily unavailable.',
};

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

const readApiErrorMessage = (data: unknown): string | null => {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  const message = (data as { message?: unknown }).message;
  return typeof message === 'string' && message.trim().length > 0
    ? message
    : null;
};

export const resolveQueryErrorMessage = (
  error: unknown,
  fallback = 'Failed to load weather data',
): string => {
  if (!error) {
    return fallback;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (!isFetchBaseQueryError(error)) {
    return fallback;
  }

  if (error.status === 'FETCH_ERROR') {
    return 'Could not reach the server. Check that the backend is running.';
  }

  if (error.status === 'PARSING_ERROR') {
    return 'Received an invalid response from the server.';
  }

  if (error.status === 'TIMEOUT_ERROR') {
    return 'The request timed out. Please try again.';
  }

  const apiMessage = readApiErrorMessage(error.data);
  if (apiMessage) {
    return apiMessage;
  }

  if (typeof error.status === 'number') {
    return HTTP_STATUS_MESSAGES[error.status] ?? fallback;
  }

  return fallback;
};

export const getQueryErrorMessage = (error: unknown): string | null => {
  if (!error) {
    return null;
  }
  return resolveQueryErrorMessage(error);
};

export const mapQueryToAsyncStatus = (query: QueryStatusInput): AsyncStatus => {
  if (query.isLoading) {
    return AsyncStatus.LOADING;
  }
  if (query.isError) {
    return AsyncStatus.FAILED;
  }
  if (query.isSuccess) {
    return AsyncStatus.SUCCEEDED;
  }
  return AsyncStatus.IDLE;
};
