import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [MatIconModule],
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

  toggleTune(): void {
    this.timeFrame = this.timeFrame === 'hourly' ? 'daily' : 'hourly';
    this.MapService.setTimeFrame(this.timeFrame);
  }
}
