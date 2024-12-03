import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  WeatherData,
  LocationMetrics,
  MetricParams,
} from '../../types/mapTypes';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private foreCastLocationsUrl =
    'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
  private map: L.Map | null = null;

  private timeFrameSubject = new BehaviorSubject<'hourly' | 'daily'>('hourly');
  timeFrame$ = this.timeFrameSubject.asObservable();

  constructor(private http: HttpClient) {}

  setTimeFrame(mode: 'hourly' | 'daily'): void {
    this.timeFrameSubject.next(mode);
  }

  setMapInstance(mapInstance: L.Map): void {
    this.map = mapInstance;
  }

  getTimeFrame(): 'hourly' | 'daily' {
    return this.timeFrameSubject.value;
  }

  // gets locations
  getWeatherData(): Observable<WeatherData> {
    return this.http.get<WeatherData>(this.foreCastLocationsUrl);
  }

  getLocationMetrics(
    latitude: string | number,
    longitude: string | number
  ): Observable<LocationMetrics> {
    const queryParams: MetricParams = {
      latitude: `${latitude}`,
      longitude: `${longitude}`,
      hourly: 'relativehumidity_2m,direct_radiation',
      daily: 'temperature_2m_max,temperature_2m_min',
      timezone: 'Asia/Singapore',
      start_date: '2024-11-01',
      end_date: '2024-11-10',
    };

    let params = new HttpParams();
    Object.keys(queryParams).forEach((key) => {
      params = params.set(key, queryParams[key as keyof MetricParams]);
    });

    const metricsLocationUrl = 'https://api.open-meteo.com/v1/forecast';
    console.log(`Request URL: ${metricsLocationUrl}?${params.toString()}`);
    return this.http.get<LocationMetrics>(metricsLocationUrl, { params });
  }
  panToLocation(latitude: string | number, longitude: string | number): void {
    if (this.map) {
      this.map.setView([latitude as number, longitude as number], 16);
    } else {
      console.log('Map instance not found');
    }
  }
}
