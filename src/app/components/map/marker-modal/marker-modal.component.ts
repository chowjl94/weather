import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LocationMetrics } from '../../../types/mapTypes';
import { MapService } from '../../../services/map/map.service';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class MarkerModalComponent implements OnInit {
  locationData: LocationMetrics | null = null;
  dashboardView!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; latitude: number; longitude: number },
    private mapService: MapService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const latitude = `${this.data.latitude}`;
    const longitude = `${this.data.longitude}`;

    this.mapService.getLocationMetrics(latitude, longitude).subscribe({
      next: (response) => {
        this.locationData = response;
        this.plotChart();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  plotChart(): void {}

  switchView(viewName: string) {
    this.dashboardView = viewName;
    console.log(`Switched to view: ${this.dashboardView}`);
  }
}
