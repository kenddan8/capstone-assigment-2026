import { WeatherSnapshot } from '../services/weather';

export interface OutfitItem {
  category: string;
  name: string;
  reason: string;
  retailer: string;
  retailerNote: string;
  shopUrl: string;
}

export interface OutfitSuggestion {
  title: string;
  occasion: string;
  summary: string;
  items: OutfitItem[];
}

interface Retailer {
  name: string;
  searchUrl: string;
  note: string;
}

const apparelRetailers: Retailer[] = [
  {
    name: 'Hanifa',
    searchUrl: 'https://hanifa.co/search?q=',
    note: 'Black-owned contemporary womenswear',
  },
  {
    name: 'Diarrablu',
    searchUrl: 'https://diarrablu.com/search?q=',
    note: 'Black-owned, made-to-order fashion',
  },
  {
    name: 'Kai Collective',
    searchUrl: 'https://kaicollective.com/search?q=',
    note: 'Black-owned statement womenswear',
  },
  {
    name: 'Zelie for She',
    searchUrl: 'https://www.zelieforshe.com/search?q=',
    note: 'Black-owned size-inclusive fashion',
  },
];

const footwearRetailer: Retailer = {
  name: 'Brother Vellies',
  searchUrl: 'https://brothervellies.com/search?q=',
  note: 'Black-owned luxury footwear and accessories',
};

const accessoryRetailer: Retailer = {
  name: 'Brandon Blackwood',
  searchUrl: 'https://brandonblackwood.com/search?q=',
  note: 'Black-owned contemporary accessories',
};

const weatherRetailer: Retailer = {
  name: 'Nordstrom',
  searchUrl: 'https://www.nordstrom.com/sr?keyword=',
  note: 'Broad assortment with inclusive brands and sizing',
};

let apparelRetailerIndex = 0;

const selectRetailer = (category: string): Retailer => {
  if (category === 'Shoes') return footwearRetailer;
  if (category === 'Accessory') return accessoryRetailer;
  if (category === 'Weather extra') return weatherRetailer;

  const retailer = apparelRetailers[apparelRetailerIndex % apparelRetailers.length];
  apparelRetailerIndex += 1;
  return retailer;
};

const searchTerms: Record<string, string> = {
  Base: 'tops',
  Top: 'tops',
  Layer: 'jackets',
  Outerwear: 'coats',
  Bottom: 'pants',
  Shoes: 'shoes',
  Accessory: 'bags',
  'Weather extra': 'umbrella',
};

const createItem = (category: string, name: string, reason: string): OutfitItem => {
  const retailer = selectRetailer(category);

  return {
    category,
    name,
    reason,
    retailer: retailer.name,
    retailerNote: retailer.note,
    shopUrl: `${retailer.searchUrl}${encodeURIComponent(searchTerms[category] ?? name)}`,
  };
};

const variations: Record<'cold' | 'mild' | 'warm', OutfitSuggestion[]> = {
  cold: [
    {
      title: 'Warm structure, easy layers',
      occasion: 'Workday to dinner',
      summary: 'A polished cold-weather mix with strong lines, rich texture, and layers that move easily from the office to dinner.',
      items: [
        createItem('Base', 'Merino crewneck sweater', 'Breathable warmth for temperature swings.'),
        createItem('Outerwear', 'Water-resistant wool coat', 'Blocks wind and handles light precipitation.'),
        createItem('Bottom', 'Straight-leg dark denim', 'Substantial fabric keeps the outfit warm.'),
        createItem('Shoes', 'Weatherproof leather boots', 'Warm and grippy on damp pavement.'),
      ],
    },
    {
      title: 'Cold-day utility',
      occasion: 'Weekend and community plans',
      summary: 'Soft insulation and practical pieces for errands, a community event, or a relaxed weekend around the city.',
      items: [
        createItem('Base', 'Cotton mock-neck top', 'A comfortable first layer that traps warmth.'),
        createItem('Outerwear', 'Lightweight insulated jacket', 'Warm outside and easy to carry indoors.'),
        createItem('Bottom', 'Tailored corduroy trousers', 'Soft texture with dependable warmth.'),
        createItem('Shoes', 'Cushioned high-top sneakers', 'Closed coverage with all-day comfort.'),
      ],
    },
  ],
  mild: [
    {
      title: 'Atlanta in-between',
      occasion: 'Creative workday',
      summary: 'Clean tailoring and expressive proportions for a creative workday, with light layers for changing indoor temperatures.',
      items: [
        createItem('Top', 'Oxford button-down shirt', 'Crisp, breathable, and comfortable on its own.'),
        createItem('Layer', 'Unlined chore jacket', 'Adds coverage for cooler moments.'),
        createItem('Bottom', 'Relaxed tailored chinos', 'A versatile midweight option.'),
        createItem('Shoes', 'Low-profile leather sneakers', 'Comfortable without looking too casual.'),
      ],
    },
    {
      title: 'Light-layer rhythm',
      occasion: 'Brunch and gallery afternoon',
      summary: 'An adaptable, elevated combination for brunch or a gallery afternoon that starts cool and settles comfortably.',
      items: [
        createItem('Top', 'Fine-gauge cotton knit', 'Breathable with more coverage than a tee.'),
        createItem('Layer', 'Lightweight utility overshirt', 'Easy to remove as the temperature rises.'),
        createItem('Bottom', 'Wide-leg twill trousers', 'Airy movement in a midweight fabric.'),
        createItem('Shoes', 'Suede walking shoes', 'Soft structure for dry, mild conditions.'),
      ],
    },
  ],
  warm: [
    {
      title: 'Heat, handled',
      occasion: 'Errands and casual plans',
      summary: 'Breathable shapes and sun-ready details that stay composed through errands, lunch, and casual plans.',
      items: [
        createItem('Top', 'Relaxed linen-blend shirt', 'Loose natural fibers help release heat.'),
        createItem('Bottom', 'Lightweight pleated shorts', 'Airy and polished for warm weather.'),
        createItem('Shoes', 'Breathable canvas sneakers', 'Light underfoot with useful airflow.'),
        createItem('Accessory', 'Structured mini handbag', 'A compact finishing piece for daytime plans.'),
      ],
    },
    {
      title: 'Breezy city uniform',
      occasion: 'Travel day',
      summary: 'Minimal, breathable pieces with enough polish for a comfortable travel day as the temperature climbs.',
      items: [
        createItem('Top', 'Premium heavyweight T-shirt', 'A clean silhouette without extra layers.'),
        createItem('Bottom', 'Breathable linen trousers', 'Full-length coverage with cooling airflow.'),
        createItem('Shoes', 'Minimal mesh trainers', 'Ventilation and cushioning for hot pavement.'),
        createItem('Accessory', 'Lightweight crossbody bag', 'Keeps essentials close without adding bulk.'),
      ],
    },
  ],
};

export const generateOutfit = (
  weather: WeatherSnapshot,
  previousTitle?: string,
): OutfitSuggestion => {
  const category =
    weather.apparentTemperature < 52
      ? 'cold'
      : weather.apparentTemperature < 76
        ? 'mild'
        : 'warm';
  const group = variations[category];
  const available = group.filter((suggestion) => suggestion.title !== previousTitle);
  const suggestion = available[Math.floor(Math.random() * available.length)] ?? group[0];
  const wetWeather = weather.weatherCode >= 51;

  if (!wetWeather) return suggestion;

  return {
    ...suggestion,
    summary: `${suggestion.summary} Rain is in the forecast, so add dependable coverage and protect your hairstyle if needed.`,
    items: [
      ...suggestion.items,
      createItem('Weather extra', 'Compact windproof umbrella', 'Keeps the full outfit ready for rain.'),
    ],
  };
};