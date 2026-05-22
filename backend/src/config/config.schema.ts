import * as Joi from 'joi';
import { CacheDriver } from './configuration';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  CLIENT_APP_HOST: Joi.string().default('http://localhost:5173'),
  OPENWEATHER_API_KEY: Joi.string().required(),
  WEATHER_CACHE_TTL_SECONDS: Joi.number().default(300),
  GEOCODER_CACHE_TTL_SECONDS: Joi.number().default(3600),
  CACHE_DRIVER: Joi.string()
    .valid(CacheDriver.MEMORY, CacheDriver.REDIS)
    .default(CacheDriver.MEMORY),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
});
