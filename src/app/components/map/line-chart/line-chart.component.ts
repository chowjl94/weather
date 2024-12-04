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

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.updateChart();
    });
  }

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
    const { labels, datasets, xtext, ytext, units } = this.getChartData();
    const fontsize = this.getResponsiveFontSize();

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
            pointRadius: 2,
            pointHoverRadius: 2,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const datasetLabel = tooltipItem.dataset.label || '';
                  const value = tooltipItem.raw;
                  return `${datasetLabel}: ${value}${units}`;
                },
              },
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#fff',
                font: {
                  size: this.getResponsiveFontSize(),
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: xtext,
                color: '#fff',
                font: {
                  size: fontsize,
                },
              },
              ticks: {
                color: '#fff',
                font: {
                  size: fontsize,
                  lineHeight: 4,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: ytext,
                color: '#fff',
                font: {
                  size: fontsize,
                },
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
    const { labels, datasets, xtext, ytext, units } = this.getChartData();
    const fontSize = this.getResponsiveFontSize();
    const maxTicksLimit = this.getMaxTicksLimit();
    if (this.lineChart) {
      this.lineChart.data.labels = labels;
      (this.lineChart.data.datasets = datasets.map((dataset) => ({
        ...dataset,
        borderColor: `#fff`,
        backgroundColor: `#fff`,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 2,
      }))),
        (this.lineChart.options = {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              title: {
                color: '#fff',
                display: true,
                text: xtext || 'Time',
                font: {
                  size: fontSize,
                },
              },
              ticks: {
                color: '#fff',
                font: {
                  size: fontSize,
                },
                maxTicksLimit,
              },
            },
            y: {
              title: {
                color: '#fff',
                display: true,
                text: ytext || 'Value',
                font: {
                  size: fontSize,
                },
              },
              ticks: {
                color: '#fff',
                font: {
                  size: fontSize,
                },
                maxTicksLimit,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const datasetLabel = tooltipItem.dataset.label || '';
                  const value = tooltipItem.raw;
                  return `${datasetLabel}: ${value}${units}`;
                },
              },
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#fff',
                font: {
                  size: this.getResponsiveFontSize(),
                },
              },
            },
          },
        });
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
    units?: string;
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
        units?: string;
      }
    > = {
      Weather: () => ({
        labels: this.data?.hourly.time.map((time) => formatTime(time)) || [],
        datasets: [
          {
            data: this.data?.hourly.relative_humidity_2m || [],
            label: 'Relative Humidity',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
        xtext: 'Time',
        ytext: 'Relative Humidity',
        units: this.data?.hourly_units.relative_humidity_2m,
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
        units: this.data?.hourly_units.direct_radiation,
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
        units: this.data?.daily_units.temperature_2m_max,
      }),
    };

    const defaultConfig = {
      labels: [],
      datasets: [],
      xtext: 'Time',
      ytext: 'No Data',
      units: '',
    };

    return chartConfig[this.dashboardView]?.() || defaultConfig;
  }

  private getResponsiveFontSize(): number {
    const width = window.innerWidth;
    if (width < 600) {
      return 6;
    } else if (width < 960) {
      return 7;
    }
    return 10;
  }

  private getMaxTicksLimit(): number {
    const width = window.innerWidth;
    if (width < 600) {
      return 5;
    } else if (width < 960) {
      return 10;
    }
    return 30;
  }
}
