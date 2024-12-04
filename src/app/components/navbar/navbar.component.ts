import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { startWith, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { MapService } from '../../services/map/map.service';
import { WeatherData } from '../../types/mapTypes';
import { formatDateToYMD } from '../../utils/helper';

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
    MatFormFieldModule,
    MatDatepickerModule,
  ],
})
export class NavbarComponent {
  timeFrame: 'hourly' | 'daily' = 'hourly';
  searchControl = new FormControl();
  suggestions$: Observable<string[]>;
  dateRangeForm: FormGroup;

  constructor(private mapService: MapService, private fb: FormBuilder) {
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

    this.dateRangeForm = this.fb.group({
      startDate: [formatDateToYMD(new Date())],
      endDate: [formatDateToYMD(new Date())],
    });

    this.mapService.setDateRangeForm(this.dateRangeForm);
  }

  search(): void {
    const query = this.searchControl.value;
    if (query) {
      console.log(`Searching for: ${query} and panning to ${query}`);
      this.mapService.getWeatherData().subscribe((data: WeatherData) => {
        const matchedLocation = data.area_metadata.find(
          (metadata) =>
            metadata.name.replace(/\s+/g, '').toLowerCase() ===
            query.replace(/\s+/g, '').toLowerCase()
        );
        if (matchedLocation) {
          const { latitude, longitude } = matchedLocation.label_location;
          console.log(latitude, longitude);
          this.mapService.panToLocation(latitude, longitude);
        } else {
          console.log('No matching location');
        }
      });
    }
  }

  toggleTimeFrame(): void {
    this.timeFrame = this.timeFrame === 'hourly' ? 'daily' : 'hourly';
    this.mapService.setTimeFrame(this.timeFrame);
  }

  submitDateRange(): void {
    const { startDate, endDate } = this.dateRangeForm.value;

    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      console.log('Selected date range:', {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    } else {
      console.log('Please select a complete date range.');
    }
  }

  resetDateRange(): void {
    this.dateRangeForm.reset({
      startDate: null,
      endDate: null,
    });
  }
}
