import { afterEach, describe, expect, test, vi } from 'vitest';
import { generateOutfit } from './outfits';
import { WeatherSnapshot } from '../services/weather';

const weather = (overrides: Partial<WeatherSnapshot> = {}): WeatherSnapshot => ({
  temperature: 70,
  apparentTemperature: 70,
  precipitationChance: 10,
  humidity: 50,
  windSpeed: 5,
  weatherCode: 1,
  observedAt: '2026-08-04T10:00',
  note: 'Stable conditions.',
  ...overrides,
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('outfit generation', () => {
  test('selects warm layers for cold apparent temperatures', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const suggestion = generateOutfit(weather({ apparentTemperature: 40 }));

    expect(suggestion.items.some((item) => item.category === 'Outerwear')).toBe(true);
    expect(suggestion.items.every((item) => item.shopUrl.startsWith('https://'))).toBe(true);
    expect(suggestion.items.every((item) => item.retailer.length > 0)).toBe(true);
    expect(suggestion.items.every((item) => item.retailerNote.includes('Black-owned'))).toBe(true);
    expect('imageUrl' in suggestion).toBe(false);
    expect('imageAlt' in suggestion).toBe(false);
    expect(suggestion.occasion.length).toBeGreaterThan(0);
  });

  test('adds rain protection when precipitation conditions are present', () => {
    const suggestion = generateOutfit(weather({ weatherCode: 61 }));

    expect(suggestion.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Compact windproof umbrella' })]),
    );
    expect(suggestion.summary).toContain('protect your hairstyle if needed');
  });

  test('does not repeat the previous recommendation during regeneration', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const firstSuggestion = generateOutfit(weather());

    const regeneratedSuggestion = generateOutfit(weather(), firstSuggestion.title);

    expect(regeneratedSuggestion.title).not.toBe(firstSuggestion.title);
    expect(regeneratedSuggestion.occasion).not.toBe(firstSuggestion.occasion);
  });
});