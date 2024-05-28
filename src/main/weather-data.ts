import { net } from 'electron';

type WeatherValue = { raw: number };

type OneFormatWeatherValue = WeatherValue & { formatted: string };

type TwoFormatWeatherValue = WeatherValue & { short: string; long: string };

type CurrentWeatherData = {
  main: {
    temperature: TwoFormatWeatherValue;
    minTemperature: TwoFormatWeatherValue;
    maxTemperature: TwoFormatWeatherValue;
    feelsLike: TwoFormatWeatherValue;
    humidity: OneFormatWeatherValue;
  };
};

type WeatherData = { current: CurrentWeatherData };

type CurrentOwmData = {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
  };
};

const kelvinsToCelsius = (kelvins: number) => kelvins - 273.15;

const getTemperatureWeatherValue = (kelvins: number): TwoFormatWeatherValue => {
  const rounded = Math.round(kelvinsToCelsius(kelvins));
  return { raw: rounded, short: `${rounded}°`, long: `${rounded}°C` };
};

const getPercentWeatherValue = (percent: number): OneFormatWeatherValue => ({
  raw: percent,
  formatted: `${percent}%`,
});

const getCurrentWeatherData = (
  currentOwmData: CurrentOwmData,
): CurrentWeatherData => ({
  main: {
    temperature: getTemperatureWeatherValue(currentOwmData.main.temp),
    minTemperature: getTemperatureWeatherValue(currentOwmData.main.temp_min),
    maxTemperature: getTemperatureWeatherValue(currentOwmData.main.temp_max),
    feelsLike: getTemperatureWeatherValue(currentOwmData.main.feels_like),
    humidity: getPercentWeatherValue(currentOwmData.main.humidity),
  },
});

const getOwmData = async <T>(endpoint: string, lat: number, lon: number): Promise<T> => {
  const url = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
  url.searchParams.append('lat', lat.toString());
  url.searchParams.append('lon', lon.toString());
  url.searchParams.append('appid', process.env.OWM_KEY!);
  const response = await net.fetch(`${url}`);
  if (!response.ok) {
    throw new Error(
      `OpenWeatherMap API call failed for \`${endpoint}\` (${response.status}).`,
    );
  }
  return response.json();
};

const getWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  let currentOwmData: CurrentOwmData;
  try {
    currentOwmData = await getOwmData('weather', lat, lon);
  } catch {
    return null;
  }
  return { current: getCurrentWeatherData(currentOwmData) };
};

const test = async (): Promise<string | null> => {
  return 'xdddd';
};

export { getWeatherData, WeatherData };
export { test };
