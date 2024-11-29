import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-minimap',
  imports: [],
  templateUrl: './minimap.component.html',
  styleUrl: './minimap.component.css',
})
export class MinimapComponent implements OnInit {
  @Input() latitude: number = 1.3521; // Default to Singapore
  @Input() longitude: number = 103.8198; // Default to Singapore
  @Input() zoom: number = 12; // Default zoom level

  map: L.Map | undefined;

  ngOnInit(): void {
    this.configureMap();
  }

  configureMap() {
    this.map = L.map('minimap').setView(
      [this.latitude, this.longitude],
      this.zoom
    ); // SG coords
    // this.map = L.map('map').setView([1.125, 104.0], 11); // Asia/Singapore

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }
}
