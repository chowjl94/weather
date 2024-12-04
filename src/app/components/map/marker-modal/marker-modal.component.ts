import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  Daily,
  DailyUnits,
  KeyLabelMapping,
  LocationMetrics,
} from '../../../types/mapTypes';
import { MapService } from '../../../services/map/map.service';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { MinimapComponent } from '../minimap/minimap.component';
import { Observable } from 'rxjs';
import { formatDate } from '../../../utils/helper';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    LineChartComponent,
    MinimapComponent,
  ],
})
export class MarkerModalComponent implements OnInit {
  locationData: LocationMetrics | null = null;
  dashboardView!: string;
  minMaxValues: number[] = [];
  timeFrame!: Observable<'hourly' | 'daily'>;
  currentTimeFrame: 'hourly' | 'daily' = 'hourly';
  dailyData: { daily: Daily } | null = null;

  keyLabelMapping: KeyLabelMapping = {
    temperature_2m_max: 'Highest Temp',
    temperature_2m_min: 'Lowest Temp',
    daylight_duration: 'Daylight',
    sunshine_duration: 'Sunshine Duration',
    uv_index_max: 'Highest UV Index',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; latitude: number; longitude: number },
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.getTimeFrame();
  }

  fetchData(): void {
    const latitude = `${this.data.latitude}`;
    const longitude = `${this.data.longitude}`;
    const dateRangeForm = this.mapService.getDateRangeForm();
    const { startDate, endDate } = dateRangeForm?.value;

    this.mapService
      .getLocationMetrics(latitude, longitude, startDate, endDate)
      .subscribe({
        next: (response) => {
          console.log(`getting location Data for ${latitude}, ${longitude}`);
          this.locationData = response;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }

  getTimeFrame(): void {
    this.timeFrame = this.mapService.timeFrame$;
    this.timeFrame.subscribe({
      next: (value) => {
        this.currentTimeFrame = value;
        console.log(`Current time frame: ${this.currentTimeFrame}`);
      },
      error: (error) => {
        console.error('Error fetching time frame:', error);
      },
    });
  }

  switchView(viewName: string) {
    this.dashboardView = viewName;
    console.log(`Switched to view: ${this.dashboardView}`);
  }

  getDailyKeys(): (keyof Daily)[] {
    return Object.keys(this.locationData?.daily || {}).filter(
      (key) => key !== 'time' && key !== 'sunrise' && key !== 'sunset'
    ) as (keyof Daily)[];
  }

  formatDateWrapper(dateString: string): string {
    return formatDate(dateString);
  }
}
