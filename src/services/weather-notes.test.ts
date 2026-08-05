import { describe, expect, test } from 'vitest';
import { createWeatherNote, describeWeatherCode } from './weather';

const forecast = (precipitationProbability: number[], temperatures = [70, 71]) => ({
  current: {
    temperature_2m: temperatures[0],
    apparent_temperature: temperatures[0],
    relative_humidity_2m: 50,
    wind_speed_10m: 5,
    weather_code: 1,
    time: '2026-08-04T10:00',
  },
  hourly: {
    time: ['2026-08-04T10:00', '2026-08-04T14:00'],
    temperature_2m: temperatures,
    precipitation_probability: precipitationProbability,
    weather_code: [1, 1],
  },
});

describe('weather notes', () => {
  test('warns about a meaningful chance of rain', () => {
    const note = createWeatherNote(forecast([10, 70]));

    expect(note).toContain('70% chance of rain');
    expect(note).toContain('if you need it');
  });

  test('suggests a removable layer when the day warms significantly', () => {
    expect(createWeatherNote(forecast([0, 0], [55, 70]))).toContain('easy to remove');
  });

  test('maps Open-Meteo codes to readable conditions', () => {
    expect(describeWeatherCode(0)).toBe('Clear sky');
    expect(describeWeatherCode(61)).toBe('Rain');
    expect(describeWeatherCode(95)).toBe('Thunderstorms');
  });

  test('offers optional hairstyle guidance when humidity is high', () => {
    const humidForecast = forecast([0, 0]);
    humidForecast.current.relative_humidity_2m = 82;

    const note = createWeatherNote(humidForecast);

    expect(note).toContain('Humidity is running high');
    expect(note).toContain('if it suits your plans');
  });
});