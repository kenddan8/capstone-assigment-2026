import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: { main: '#42421E', contrastText: '#FFFFFF' },
    secondary: { main: '#F35900', contrastText: '#FFFFFF' },
    warning: { main: '#F7B720' },
    success: { main: '#6D7636' },
    background: { default: '#F8F7F1', paper: '#FFFFFF' },
    text: { primary: '#29291A', secondary: '#5D5D4A' },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 700, letterSpacing: 0 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 650, letterSpacing: 0 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 650, letterSpacing: 0 },
    button: { fontWeight: 700, letterSpacing: 0, textTransform: 'none' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});