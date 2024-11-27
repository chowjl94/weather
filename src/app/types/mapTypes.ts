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

export interface WeatherData {
  area_metadata: AreaMetadata[];
  items: WeatherItem[];
  api_info: ApiInfo;
}
