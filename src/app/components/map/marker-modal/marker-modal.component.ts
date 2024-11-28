import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataPoint, LocationMetrics } from '../../../types/mapTypes';
import { MapService } from '../../../services/map/map.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class MarkerModalComponent implements OnInit {
  locationData: LocationMetrics | null = null;

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

  plotChart(): void {
    if (!this.locationData || !this.locationData.hourly) return;

    const data = this.locationData.hourly;
    const time = data.time.map((t) => new Date(t));
    const relativeHumidity = data.relativehumidity_2m;

    if (!time.length || !relativeHumidity.length) {
      console.error('Time or relativeHumidity data is empty.');
      return;
    }

    const extent = d3.extent(time) as [Date, Date];
    if (!extent[0] || !extent[1]) {
      console.error('Invalid time data for d3 scale domain.');
      return;
    }

    const maxHumidity = d3.max(relativeHumidity);
    if (maxHumidity === undefined) {
      console.error('relativeHumidity array contains invalid values.');
      return;
    }

    // Set up margins, width, and height
    const svg = d3.select(this.elementRef.nativeElement.querySelector('svg'));
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    // Define scales
    const x = d3.scaleTime().domain(extent).range([0, width]);
    const y = d3.scaleLinear().domain([0, maxHumidity]).nice().range([400, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeHour.every(1), '%H:%M'));

    // Add Y-axis
    g.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

    // Prepare data for the line chart
    const lineData = time.map(
      (t, i) => [t, relativeHumidity[i]] as [Date, number]
    );
    console.log(lineData);

    // Define the line generator
    const line = d3
      .line<[Date, number]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    console.log(line);
    g.append('path')
      .datum(lineData)
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2);
  }
}
