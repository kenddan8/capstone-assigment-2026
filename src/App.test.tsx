import React from 'react';
import { ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from './App';
import { appTheme } from './theme';

const weatherResponse = {
  current: {
    temperature_2m: 72,
    apparent_temperature: 72,
    relative_humidity_2m: 58,
    wind_speed_10m: 6,
    weather_code: 1,
    time: '2026-08-04T10:00',
  },
  hourly: {
    time: ['2026-08-04T10:00', '2026-08-04T14:00'],
    temperature_2m: [72, 77],
    precipitation_probability: [5, 10],
    weather_code: [1, 1],
  },
};

afterEach(() => {
  vi.restoreAllMocks();
});

test('loads Atlanta weather and enables Dress Me on the home screen', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => weatherResponse });
  vi.stubGlobal('fetch', fetchMock);

  render(
    <ThemeProvider theme={appTheme}>
      <App />
    </ThemeProvider>,
  );

  const dressButton = screen.getByRole('button', { name: 'Dress Me' });
  expect(dressButton.hasAttribute('disabled')).toBe(true);
  expect(await screen.findByText('72°')).not.toBeNull();
  expect(screen.getByText(/Atlanta, GA/)).not.toBeNull();
  expect(screen.getByText('Precipitation')).not.toBeNull();
  expect(screen.getByText('5%')).not.toBeNull();
  expect(screen.getByText('Humidity')).not.toBeNull();
  expect(screen.getByText('58%')).not.toBeNull();
  expect(screen.getByText('Wind')).not.toBeNull();
  expect(screen.getByText('6 mph')).not.toBeNull();
  expect(dressButton.hasAttribute('disabled')).toBe(false);
  expect(screen.queryByLabelText('Weather change note')).toBeNull();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('displays a dash for unavailable weather metrics', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...weatherResponse,
        current: {
          ...weatherResponse.current,
          temperature_2m: null,
          relative_humidity_2m: undefined,
          wind_speed_10m: null,
        },
        hourly: {
          time: weatherResponse.hourly.time,
          temperature_2m: weatherResponse.hourly.temperature_2m,
          weather_code: weatherResponse.hourly.weather_code,
        },
      }),
    }),
  );

  render(
    <ThemeProvider theme={appTheme}>
      <App />
    </ThemeProvider>,
  );

  expect(await screen.findByLabelText('Temperature: -')).not.toBeNull();
  expect(screen.getByLabelText('Precipitation: unavailable').textContent).toContain('-');
  expect(screen.getByLabelText('Humidity: unavailable').textContent).toContain('-');
  expect(screen.getByLabelText('Wind: unavailable').textContent).toContain('-');
});

test('reveals an outfit modal after Dress Me is activated', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => weatherResponse }),
  );
  vi.stubGlobal('scrollTo', vi.fn());

  render(
    <ThemeProvider theme={appTheme}>
      <App />
    </ThemeProvider>,
  );

  const dressButton = screen.getByRole('button', { name: 'Dress Me' });
  expect(await screen.findByText('72°')).not.toBeNull();
  fireEvent.click(dressButton);

  expect(dressButton.hasAttribute('disabled')).toBe(true);
  expect(await screen.findByRole('dialog', { name: 'Dress for the day ahead.' })).not.toBeNull();
  expect(screen.getByRole('button', { name: 'Close results' })).not.toBeNull();
  expect(screen.getByLabelText('Weather change note')).not.toBeNull();
  expect(screen.getByLabelText('Generated outfit recommendation')).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Close results' }));

  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Dress Me' })).not.toBeNull();
});
