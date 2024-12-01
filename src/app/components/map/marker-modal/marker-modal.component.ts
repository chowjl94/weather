import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LocationMetrics } from '../../../types/mapTypes';
import { MapService } from '../../../services/map/map.service';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { MinimapComponent } from '../minimap/minimap.component';
import { Observable } from 'rxjs';

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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; latitude: number; longitude: number },
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    // this.timeFrame = this.mapService.timeFrame$; subscribe to timeFrame
    this.getTimeFrame();
  }

  fetchData(): void {
    const latitude = `${this.data.latitude}`;
    const longitude = `${this.data.longitude}`;

    this.mapService.getLocationMetrics(latitude, longitude).subscribe({
      next: (response) => {
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

  // showItem(viewName: 'Radiation' | 'Weather' | 'Temperature'): boolean {
  //   this.dashboardView = viewName;
  //   return (
  //     (this.currentTimeFrame === 'hourly' &&
  //       (this.dashboardView === 'Radiation' ||
  //         this.dashboardView === 'Weather')) ||
  //     (this.currentTimeFrame === 'daily' &&
  //       this.dashboardView === 'Temperature')
  //   );
  // }
}
