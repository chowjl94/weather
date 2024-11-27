import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map/map.service';

import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from '../../types/mapTypes';
import { MarkerModalComponent } from './marker-modal/marker-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  imports: [],
})
export class MapComponent implements OnInit {
  map: L.Map | undefined;
  weatherMetaData: WeatherData | undefined;

  constructor(
    private mapService: MapService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.configureMap();
    this.getMarkers();
  }

  getMarkers() {
    this.mapService.getWeatherData().subscribe((data) => {
      this.weatherMetaData = data;
      this.addMarkers();
    });
  }

  openMarkerModal(data: { name: string; latitude: number; longitude: number }) {
    this.dialog.open(MarkerModalComponent, {
      width: '700px',
      data,
    });
  }

  addMarkers() {
    if (this.weatherMetaData) {
      const areaData = this.weatherMetaData.area_metadata;
      areaData.forEach((area) => {
        const { label_location, name } = area;
        const { latitude, longitude } = label_location;
        const defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
          iconSize: [20, 39],
          iconAnchor: [7, 36],
          popupAnchor: [0, -36],
        });
        if (this.map) {
          const marker = L.marker([latitude, longitude], {
            icon: defaultIcon,
          }).addTo(this.map);
          marker.on('click', () => {
            this.openMarkerModal({ name, latitude, longitude });
          });
        }
      });
    }
  }

  configureMap() {
    // this.map = L.map('map').setView([1.3521, 103.8198], 12); // SG coords
    this.map = L.map('map').setView([1.125, 104.0], 11); // Asia/Singapore

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }
}
