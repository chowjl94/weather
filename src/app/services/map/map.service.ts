import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData, LocationMetrics } from '../../types/mapTypes';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private foreCastLocationsUrl =
    'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

  constructor(private http: HttpClient) {}

  // gets weather forecast and locations
  getWeatherData(): Observable<WeatherData> {
    return this.http.get<WeatherData>(this.foreCastLocationsUrl);
  }

  getLocationMetrics(
    latitude: string,
    longitude: string
  ): Observable<LocationMetrics> {
    const metricsLocationUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2024-11-01&end_date=2024-11-10`;

    return this.http.get<LocationMetrics>(metricsLocationUrl);
  }
}
