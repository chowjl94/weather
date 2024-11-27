import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData } from '../../types/mapTypes';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private apiUrl =
    'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

  constructor(private http: HttpClient) {}

  getWeatherData(): Observable<WeatherData> {
    return this.http.get<WeatherData>(this.apiUrl);
  }
}
