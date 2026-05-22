import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { AppConfig } from '../../../config/configuration';

@Injectable()
export class OpenWeatherHttpService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async get<T>(url: string): Promise<T> {
    const requestUrl = new URL(url);
    const apiKey = this.config.get('openWeatherApiKey', { infer: true });
    requestUrl.searchParams.set('appid', apiKey);
    const { data } = await firstValueFrom(this.http.get<T>(requestUrl.toString()));
    return data;
  }
}
