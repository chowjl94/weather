import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: L.Map | undefined;

  areaMetadata = [
    {
      name: 'Ang Mo Kio',
      label_location: {
        latitude: 1.375,
        longitude: 103.839,
      },
    },
    {
      name: 'Jurong East',
      label_location: {
        latitude: 1.332,
        longitude: 103.743,
      },
    },
  ];

  ngOnInit(): void {
    this.configMap();
  }

  configMap() {
    this.map = L.map('map').setView([1.3521, 103.8198], 12); // SG coords
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.areaMetadata.forEach((area) => {
      const { latitude, longitude } = area.label_location;
      const name = area.name;
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png', // default icon
        iconSize: [20, 39],
        iconAnchor: [7, 36],
        popupAnchor: [0, -36],
      });

      if (this.map) {
        L.marker([latitude, longitude], { icon: defaultIcon })
          .addTo(this.map)
          .bindPopup(`<b>${name}</b>`) // to popup a modal that shows data
          .openPopup();
      }
    });
  }
}
