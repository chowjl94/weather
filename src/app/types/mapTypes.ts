interface LabelLocation {
  latitude: number;
  longitude: number;
}

interface AreaMetadata {
  name: string;
  label_location: LabelLocation;
}

interface ValidPeriod {
  start: string;
  end: string;
}

interface Forecast {
  area: string;
  forecast: string;
}

interface WeatherItem {
  update_timestamp: string;
  timestamp: string;
  valid_period: ValidPeriod;
  forecasts: Forecast[];
}

interface ApiInfo {
  status: string;
}

interface HourlyUnits {
  time: string;
  relative_humidity_2m: string;
  direct_radiation: string;
  precipitation: string;
  precipitation_probability: string;
  rain: string;
  showers: string;
}

interface Hourly {
  time: string[];
  relative_humidity_2m: number[];
  direct_radiation: number[];
  precipitation: number[];
  precipitation_probability: number[];
  rain: number[];
  showers: number[];
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  daylight_duration: string;
  sunrise: string;
  sunset: string;
  sunshine_duration: string;
  uv_index_max: string;
}

export interface Daily {
  daylight_duration: number[];
  sunrise: string[];
  sunset: string[];
  sunshine_duration: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  time: string[];
  uv_index_max: number[];
}

export interface WeatherData {
  area_metadata: AreaMetadata[];
  items: WeatherItem[];
  api_info: ApiInfo;
}

export interface LocationMetrics {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface DataPoint {
  date: Date;
  value: number;
}

export interface MetricParams {
  latitude: string | number;
  longitude: string | number;
  hourly: string;
  daily: string;
  timezone: string;
  start_date: string;
  end_date: string;
}

export interface KeyLabelMapping {
  [key: string]: string;
}
