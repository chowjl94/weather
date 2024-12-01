import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MapService } from '../../services/map/map.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
})
export class NavbarComponent {
  timeFrame: 'hourly' | 'daily' = 'hourly';

  constructor(private MapService: MapService) {
    this.timeFrame = this.MapService.getTimeFrame();
  }

  search(): void {
    // todo : add search area then when submit pan to the location
    // todo : add a auto complete for suggestion
    console.log('Search function called');
  }

  toggleTimeFrame(): void {
    this.timeFrame = this.timeFrame === 'hourly' ? 'daily' : 'hourly';
    this.MapService.setTimeFrame(this.timeFrame);
  }
}
