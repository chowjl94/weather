import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LocationMetrics } from '../../../types/mapTypes';
import { MapService } from '../../../services/map/map.service';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
})
export class MarkerModalComponent implements OnInit {
  additionalData: LocationMetrics | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; latitude: number; longitude: number },
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const latitude = this.data.latitude.toString();
    const longitude = this.data.longitude.toString();
    console.log(latitude, 'lat');
    console.log(latitude, 'log');

    this.mapService.getLocationMetrics(latitude, longitude).subscribe(
      (response) => {
        this.additionalData = response;
        console.log('Fetched Data:', this.additionalData);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
