import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { LocationMetrics } from '../../../types/mapTypes';
import { formatTime } from '../../../utils/helper';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @Input() data: LocationMetrics | null | undefined;
  @Input() dashboardView!: string;
  @Input() timeframe: string | null | undefined;
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  lineChart!: Chart;

  ngAfterViewInit(): void {
    this.createLineChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lineChart && (changes['dashboardView'] || changes['data'])) {
      this.updateChart();
    }
  }

  private createLineChart(): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    const { labels, datasets, xtext, ytext } = this.getChartData();

    if (ctx) {
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets.map((dataset) => ({
            ...dataset,
            borderColor: `#fff`,
            backgroundColor: `#fff`,
            borderWidth: 2,
            tension: 0.3,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#fff',
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: xtext,
                color: '#fff',
              },
              ticks: {
                color: '#fff',
                font: {
                  size: 10,
                  lineHeight: 4,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: ytext,
                color: '#fff',
              },
              grid: {
                display: false,
              },
              ticks: {
                display: false,
                color: '#fff',
              },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  private updateChart(): void {
    const { labels, datasets, xtext, ytext } = this.getChartData();
    if (this.lineChart) {
      this.lineChart.data.labels = labels;
      this.lineChart.data.datasets = datasets.map((dataset) => ({
        ...dataset,
      }));
      this.lineChart.options.scales = {
        x: {
          title: {
            display: true,
            text: xtext || 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: ytext || 'Value',
          },
        },
      };
      this.lineChart.update();
    }
  }

  private getChartData(): {
    labels: string[];
    datasets: {
      data: number[];
      label: string;
      borderColor: string;
      backgroundColor: string;
    }[];
    xtext: string;
    ytext?: string;
  } {
    const chartConfig: Record<
      string,
      () => {
        labels: string[];
        datasets: {
          data: number[];
          label: string;
          borderColor: string;
          backgroundColor: string;
        }[];
        xtext: string;
        ytext?: string;
      }
    > = {
      Weather: () => ({
        labels: this.data?.hourly.time.map((time) => formatTime(time)) || [],
        datasets: [
          {
            data: this.data?.hourly.relativehumidity_2m || [],
            label: 'Relative Humidity',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
        xtext: 'Time',
        ytext: 'Relative Humidity',
      }),
      Radiation: () => ({
        labels: this.data?.hourly.time.map((time) => formatTime(time)) || [],
        datasets: [
          {
            data: this.data?.hourly.direct_radiation || [],
            label: 'Direct Radiation',
            borderColor: 'rgba(192, 75, 192, 1)',
            backgroundColor: 'rgba(192, 75, 192, 0.2)',
          },
        ],
        xtext: 'Time',
        ytext: 'Direct Radiation',
      }),
      Temperature: () => ({
        labels: this.data?.daily.time.map((time) => formatTime(time)) || [],
        datasets: [
          {
            data: this.data?.daily.temperature_2m_max || [],
            label: 'Daily Temperature Max',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            data: this.data?.daily.temperature_2m_min || [],
            label: 'Daily Temperature Min',
            borderColor: 'rgba(192, 75, 192, 1)',
            backgroundColor: 'rgba(192, 75, 192, 0.2)',
          },
        ],
        xtext: 'Time',
        ytext: 'Temperature',
      }),
    };

    const defaultConfig = {
      labels: [],
      datasets: [],
      xtext: 'Time',
      ytext: 'No Data',
    };

    return chartConfig[this.dashboardView]?.() || defaultConfig;
  }
}
