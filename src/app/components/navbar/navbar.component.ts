import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { startWith, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { MapService } from '../../services/map/map.service';
import { WeatherData } from '../../types/mapTypes';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class NavbarComponent {
  timeFrame: 'hourly' | 'daily' = 'hourly';
  searchControl = new FormControl();
  suggestions$: Observable<string[]>;

  constructor(private mapService: MapService) {
    this.timeFrame = this.mapService.getTimeFrame();

    this.suggestions$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      switchMap((query) =>
        this.mapService
          .getWeatherData()
          .pipe(
            map((data: WeatherData) =>
              data.area_metadata
                .map((metadata) => metadata.name)
                .filter((name) =>
                  name.toLowerCase().includes(query.toLowerCase())
                )
            )
          )
      )
    );
  }

  search(): void {
    const query = this.searchControl.value;
    if (query) {
      console.log(`Searching for: ${query} and panning to `);
      // Example: Pan to location using MapService
      // this.mapService.panToLocation(query);
    }
  }

  toggleTimeFrame(): void {
    this.timeFrame = this.timeFrame === 'hourly' ? 'daily' : 'hourly';
    this.mapService.setTimeFrame(this.timeFrame);
  }
}
