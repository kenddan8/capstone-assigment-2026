export interface WeatherSnapshot {
  temperature: number | null;
  apparentTemperature: number;
  precipitationChance: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number;
  observedAt: string;
  note: string;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m?: number | null;
    apparent_temperature?: number | null;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    weather_code?: number | null;
    time: string;
  };
  hourly: {
    time?: string[] | null;
    temperature_2m?: Array<number | null | undefined> | null;
    precipitation_probability?: Array<number | null | undefined> | null;
    weather_code?: Array<number | null | undefined> | null;
  };
}

const WEATHER_URL = new URL('https://api.open-meteo.com/v1/forecast');

const finiteNumberOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

WEATHER_URL.search = new URLSearchParams({
  latitude: '33.749',
  longitude: '-84.388',
  current:
    'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
  hourly: 'temperature_2m,precipitation_probability,weather_code',
  temperature_unit: 'fahrenheit',
  wind_speed_unit: 'mph',
  timezone: 'America/New_York',
  forecast_days: '1',
}).toString();

export const createWeatherNote = (data: OpenMeteoResponse): string => {
  const hourlyTimes = data.hourly.time ?? [];
  const foundIndex = hourlyTimes.findIndex((time) => time >= data.current.time);
  const currentIndex = Math.max(0, foundIndex);
  const remainingTemperatures = (data.hourly.temperature_2m ?? [])
    .slice(currentIndex)
    .map(finiteNumberOrNull)
    .filter((value): value is number => value !== null);
  const remainingPrecipitation = (data.hourly.precipitation_probability ?? [])
    .slice(currentIndex)
    .map(finiteNumberOrNull)
    .filter((value): value is number => value !== null);
  const remainingCodes = (data.hourly.weather_code ?? [])
    .slice(currentIndex)
    .map(finiteNumberOrNull)
    .filter((value): value is number => value !== null);

  if (remainingTemperatures.length === 0) {
    return 'Conditions should remain close to what you see now.';
  }

  const currentTemperature = finiteNumberOrNull(data.current.temperature_2m) ?? 70;
  const lowestTemperature = Math.min(...remainingTemperatures);
  const highestTemperature = Math.max(...remainingTemperatures);
  const rainChance = remainingPrecipitation.length > 0
    ? Math.max(...remainingPrecipitation)
    : 0;

  if (remainingCodes.some((code) => code >= 95)) {
    return 'Storms may develop later. Keep a rain layer nearby, protect your hairstyle if needed, and check alerts before heading out.';
  }

  if (rainChance >= 50) {
    return `${rainChance}% chance of rain later today. Carry a compact umbrella and add hairstyle protection if you need it.`;
  }

  if (currentTemperature - lowestTemperature >= 10) {
    return `Temperatures may fall about ${Math.round(
      currentTemperature - lowestTemperature,
    )}° later. Bring a layer for the cooler hours.`;
  }

  if (highestTemperature - currentTemperature >= 10) {
    return `It may warm up about ${Math.round(
      highestTemperature - currentTemperature,
    )}° today. Choose a layer that is easy to remove.`;
  }

  if ((finiteNumberOrNull(data.current.relative_humidity_2m) ?? 0) >= 75) {
    return 'Humidity is running high. Choose breathable layers and add hairstyle protection if it suits your plans.';
  }

  return 'No major weather shift is expected today. Your current layers should stay comfortable.';
};

export const fetchAtlantaWeather = async (): Promise<WeatherSnapshot> => {
  const response = await fetch(WEATHER_URL);

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;

  if (!data.current || !data.hourly) {
    throw new Error('Weather service returned an incomplete forecast');
  }

  const hourlyTimes = data.hourly.time ?? [];
  const matchingHourIndex = hourlyTimes.findIndex((time) => time >= data.current.time);
  const currentHourIndex = matchingHourIndex >= 0
    ? matchingHourIndex
    : Math.max(0, hourlyTimes.length - 1);
  const temperature = finiteNumberOrNull(data.current.temperature_2m);

  return {
    temperature,
    apparentTemperature:
      finiteNumberOrNull(data.current.apparent_temperature) ?? temperature ?? 70,
    precipitationChance: finiteNumberOrNull(
      data.hourly.precipitation_probability?.[currentHourIndex],
    ),
    humidity: finiteNumberOrNull(data.current.relative_humidity_2m),
    windSpeed: finiteNumberOrNull(data.current.wind_speed_10m),
    weatherCode: finiteNumberOrNull(data.current.weather_code) ?? 0,
    observedAt: data.current.time,
    note: createWeatherNote(data),
  };
};

export const describeWeatherCode = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  return 'Thunderstorms';
};