import { useCallback, useEffect, useRef, useState } from 'react';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import AirRoundedIcon from '@mui/icons-material/AirRounded';
import UmbrellaRoundedIcon from '@mui/icons-material/UmbrellaRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Link,
  Modal,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { generateOutfit, OutfitSuggestion } from './domain/outfits';
import {
  fetchAtlantaWeather,
  WeatherSnapshot,
} from './services/weather';

const ATLANTA_TIME_ZONE = 'America/New_York';

const formatAtlantaTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: ATLANTA_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

const formatAtlantaDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: ATLANTA_TIME_ZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);

const formatWeatherValue = (value: number | null | undefined, suffix = ''): string =>
  value == null || !Number.isFinite(value) ? '-' : `${Math.round(value)}${suffix}`;

function App() {
  const dressButtonRef = useRef<HTMLButtonElement>(null);
  const didRequestInitialWeather = useRef(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [outfit, setOutfit] = useState<OutfitSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const loadWeather = useCallback(async (): Promise<WeatherSnapshot | null> => {
    setWeatherError(null);
    setIsWeatherLoading(true);
    try {
      const latestWeather = await fetchAtlantaWeather();
      setWeather(latestWeather);
      return latestWeather;
    } catch {
      setWeatherError('Atlanta weather is unavailable right now. Please try again.');
      return null;
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    const clockRefresh = window.setInterval(() => setNow(new Date()), 30 * 1000);

    return () => {
      window.clearInterval(clockRefresh);
    };
  }, []);

  useEffect(() => {
    if (!didRequestInitialWeather.current) {
      didRequestInitialWeather.current = true;
      void loadWeather();
    }

    const weatherRefresh = window.setInterval(() => void loadWeather(), 15 * 60 * 1000);
    return () => window.clearInterval(weatherRefresh);
  }, [loadWeather]);

  const handleGenerate = async (revealResults = false) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const latestWeather = revealResults ? weather : (await loadWeather()) ?? weather;
      if (!latestWeather) throw new Error('Weather is required to generate an outfit');

      await new Promise((resolve) => window.setTimeout(resolve, 850));
      setOutfit(generateOutfit(latestWeather, outfit?.title));
      if (revealResults) {
        setIsResultsOpen(true);
      }
    } catch {
      setGenerationError('We could not build an outfit this time. Please try again.');
      if (revealResults) setIsResultsOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseResults = () => {
    if (isGenerating) return;

    setIsResultsOpen(false);
    window.requestAnimationFrame(() => dressButtonRef.current?.focus());
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#F8F7F1',
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(66,66,30,0.08) 48px)',
        }}
      >
        <Stack spacing={3.5} sx={{ width: '100%', maxWidth: 620, alignItems: 'center', textAlign: 'center', px: 2 }}>
          <Box aria-label="Current Atlanta weather" sx={{ width: '100%' }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.15rem' }, lineHeight: 1 }}>
              {formatAtlantaTime(now)}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: '0.9rem', fontWeight: 700 }}>
              {formatAtlantaDate(now)} · Atlanta, GA
            </Typography>
            {isWeatherLoading ? (
              <Skeleton variant="text" width={190} height={140} sx={{ mx: 'auto', mt: 1 }} />
            ) : weather ? (
              <Box aria-live="polite" sx={{ mt: { xs: 2.5, sm: 3.5 } }}>
                <Typography
                  variant="h1"
                  aria-label={`Temperature: ${formatWeatherValue(weather.temperature, ' degrees Fahrenheit')}`}
                  sx={{ fontSize: { xs: '6.25rem', sm: '8.5rem' }, lineHeight: 0.82 }}
                >
                  {formatWeatherValue(weather.temperature, '°')}
                </Typography>
                <Box
                  sx={{
                    mt: { xs: 3, sm: 4 },
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    borderBlock: '1px solid',
                    borderColor: 'rgba(66, 66, 30, 0.22)',
                    py: 2,
                  }}
                >
                  {[
                    {
                      label: 'Precipitation',
                      value: formatWeatherValue(weather.precipitationChance, '%'),
                      icon: <UmbrellaRoundedIcon fontSize="small" />,
                    },
                    {
                      label: 'Humidity',
                      value: formatWeatherValue(weather.humidity, '%'),
                      icon: <WaterDropRoundedIcon fontSize="small" />,
                    },
                    {
                      label: 'Wind',
                      value: formatWeatherValue(weather.windSpeed, ' mph'),
                      icon: <AirRoundedIcon fontSize="small" />,
                    },
                  ].map((metric, index) => (
                    <Stack
                      key={metric.label}
                      aria-label={`${metric.label}: ${metric.value === '-' ? 'unavailable' : metric.value}`}
                      spacing={0.5}
                      sx={{
                        minWidth: 0,
                        alignItems: 'center',
                        borderLeft: index === 0 ? 0 : '1px solid',
                        borderColor: 'rgba(66, 66, 30, 0.18)',
                        color: 'text.secondary',
                      }}
                    >
                      {metric.icon}
                      <Typography sx={{ color: 'text.primary', fontSize: { xs: '1rem', sm: '1.15rem' }, fontWeight: 800 }}>
                        {metric.value}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: '0.68rem', sm: '0.78rem' }, fontWeight: 700 }}>
                        {metric.label}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>
            ) : null}
          </Box>

          {weatherError && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => void loadWeather()}>
                  Retry
                </Button>
              }
            >
              {weatherError}
            </Alert>
          )}

          <Button
            ref={dressButtonRef}
            variant="contained"
            size="large"
            disabled={!weather || isWeatherLoading || isGenerating}
            aria-busy={isGenerating}
            onClick={() => void handleGenerate(true)}
            startIcon={isGenerating ? <CircularProgress color="inherit" size={22} /> : undefined}
            sx={{
              minWidth: 190,
              minHeight: 64,
              bgcolor: '#C2187A',
              color: '#FFFFFF',
              fontSize: '1.15rem',
              '&:hover': { bgcolor: '#9C125F' },
              '&:focus-visible': { outline: '3px solid #42421E', outlineOffset: 4 },
              '&.Mui-disabled': { bgcolor: '#C2187A', color: '#FFFFFF', opacity: 0.62 },
            }}
          >
            Dress Me
          </Button>
        </Stack>
      </Box>
      <Modal
        open={isResultsOpen}
        onClose={handleCloseResults}
        aria-labelledby="results-modal-title"
        aria-describedby="results-modal-description"
      >
        <Box
          role="dialog"
          aria-modal="true"
          aria-labelledby="results-modal-title"
          aria-describedby="results-modal-description"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
            maxWidth: 1180,
            maxHeight: { xs: 'calc(100dvh - 16px)', sm: 'calc(100dvh - 32px)' },
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: 'background.default',
            boxShadow: 24,
            outline: 0,
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 4,
              minHeight: 58,
              px: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <IconButton aria-label="Close results" onClick={handleCloseResults} disabled={isGenerating}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
          <Box sx={{ minHeight: '100%', overflow: 'hidden' }}>
      <Box
        component="header"
        sx={{
          position: 'relative',
          borderBottom: '1px solid',
          borderColor: 'rgba(66, 66, 30, 0.16)',
          background:
            'linear-gradient(125deg, rgba(247,183,32,0.24) 0%, rgba(216,207,0,0.12) 46%, rgba(109,118,54,0.14) 100%)',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: 0.22,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(66,66,30,0.12) 48px)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'flex-start' } }}
          >
            <Box sx={{ maxWidth: 650 }}>
              <Stack direction="row" spacing={1.2} sx={{ mb: 5, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#F35900',
                    color: 'white',
                    borderRadius: '50% 50% 50% 8px',
                  }}
                >
                  <WbSunnyRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Weather or Not
                </Typography>
                <Chip label="ATL" size="small" sx={{ bgcolor: '#42421E', color: 'white' }} />
              </Stack>

              <Typography
                id="results-modal-title"
                variant="h1"
                sx={{ fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' }, lineHeight: 0.95, mb: 2 }}
              >
                Dress for the day ahead.
              </Typography>
              <Typography
                id="results-modal-description"
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1.08rem', maxWidth: 560 }}
              >
                Live Atlanta weather, translated into an outfit that makes sense from first coffee to last call.
              </Typography>
            </Box>

            <Card
              component="aside"
              aria-label="Weather change note"
              variant="outlined"
              sx={{
                width: { xs: '100%', md: 330 },
                bgcolor: '#DDF3FA',
                borderColor: '#9BCAD8',
                boxShadow: '8px 8px 0 rgba(66, 66, 30, 0.12)',
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.25, alignItems: 'center' }}>
                  <TipsAndUpdatesRoundedIcon sx={{ color: '#315E6A' }} />
                  <Typography variant="overline" sx={{ color: '#315E6A', fontWeight: 800 }}>
                    Heads up
                  </Typography>
                </Stack>
                {isWeatherLoading ? (
                  <Stack spacing={0.8}>
                    <Skeleton />
                    <Skeleton width="85%" />
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: '#244A54', lineHeight: 1.6 }}>
                    {weather?.note ?? 'Weather-change guidance will return with the forecast.'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>

        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        {!outfit ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" disabled={isGenerating} onClick={() => void handleGenerate()}>
                {isGenerating ? 'Trying again' : 'Try again'}
              </Button>
            }
          >
            {generationError ?? 'An outfit recommendation is not available yet.'}
          </Alert>
        ) : (
          <Box aria-live="polite" aria-label="Generated outfit recommendation">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 3, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}
            >
              <Box>
                <Typography variant="overline" sx={{ color: '#F35900', fontWeight: 800 }}>
                  {outfit.occasion}
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' } }}>
                  {outfit.title}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                disabled={isGenerating}
                onClick={() => void handleGenerate()}
                startIcon={
                  isGenerating ? <CircularProgress color="inherit" size={18} /> : <AutorenewRoundedIcon />
                }
                sx={{ minWidth: 150, minHeight: 44 }}
              >
                {isGenerating ? 'Regenerating' : 'Regenerate'}
              </Button>
            </Stack>

            {generationError && <Alert severity="error" sx={{ mb: 3 }}>{generationError}</Alert>}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(300px, 0.85fr) minmax(0, 1.15fr)' },
                gap: { xs: 3, md: 5 },
              }}
            >
              <Box
                sx={{
                  minHeight: { md: 360 },
                  p: { xs: 3, md: 4 },
                  bgcolor: '#F7B720',
                  border: '1px solid',
                  borderColor: '#42421E',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 800, color: '#42421E' }}>
                    The styling brief
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 1.5, fontSize: { xs: '1.8rem', md: '2.4rem' }, lineHeight: 1.12 }}>
                    {outfit.summary}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 4, maxWidth: 360 }}>
                  Shop the individual pieces from the curated retailers alongside this brief.
                </Typography>
              </Box>

              <Stack divider={<Divider flexItem />} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                {outfit.items.map((outfitItem) => (
                  <Box
                    key={`${outfitItem.category}-${outfitItem.name}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '72px 1fr auto', sm: '100px 1fr auto' },
                      gap: 2,
                      alignItems: 'center',
                      py: 2.2,
                    }}
                  >
                    <Typography variant="overline" sx={{ color: '#6D7636', fontWeight: 800 }}>
                      {outfitItem.category}
                    </Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{outfitItem.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                        {outfitItem.reason}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#6D7636', fontWeight: 700 }}>
                        {outfitItem.retailer} · {outfitItem.retailerNote}
                      </Typography>
                    </Box>
                    <Link
                      href={outfitItem.shopUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Shop for ${outfitItem.name} at ${outfitItem.retailer}`}
                      underline="none"
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'grid',
                        placeItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        color: '#42421E',
                        '&:hover': { bgcolor: '#D8CF00' },
                      }}
                    >
                      <ArrowOutwardRoundedIcon fontSize="small" />
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        )}
      </Container>

      <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 2.5 }}>
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Atlanta forecast by Open-Meteo
            </Typography>
            <Button size="small" startIcon={<RefreshRoundedIcon />} onClick={() => void loadWeather()}>
              Refresh weather
            </Button>
          </Stack>
        </Container>
      </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default App;
