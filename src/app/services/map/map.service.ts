import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { WeatherData, LocationMetrics } from '../../types/mapTypes';
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
    console.log('Map instance has been set:', mapInstance); // Debug log
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
    const metricsLocationUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2024-11-01&end_date=2024-11-10`;
    return this.http.get<LocationMetrics>(metricsLocationUrl);
  }

  panToLocation(latitude: string | number, longitude: string | number): void {
    if (this.map) {
      this.map.setView([latitude as number, longitude as number], 16);
    } else {
      console.log('Map instance not found');
    }
  }
}
