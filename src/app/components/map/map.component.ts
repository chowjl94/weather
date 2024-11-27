import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map/map.service';

import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from '../../types/mapTypes';

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

  constructor(private mapService: MapService, private http: HttpClient) {}

  ngOnInit(): void {
    this.configureMap();
    this.getMarkers();
  }

  getMarkers() {
    this.mapService.getWeatherData().subscribe((data) => {
      this.weatherMetaData = data;
      console.log(this.weatherMetaData);
      // add markers to the map
      this.addMarkers();
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
          L.marker([latitude, longitude], { icon: defaultIcon })
            .addTo(this.map)
            .bindPopup(`<b>${name}</b>`)
            .openPopup();
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
