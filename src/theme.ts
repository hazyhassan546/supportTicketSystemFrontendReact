import { createTheme, alpha } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      overlayStart: string
      overlayEnd: string
      panelText: string
      panelTextMuted: string
      panelTextFaint: string
      panelDivider: string
    }
  }
  interface PaletteOptions {
    brand?: Partial<Palette['brand']>
  }
}

// Step 1 — base theme so we can reference primary.main in brand palette
const base = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
})

// Step 2 — extend with brand colours derived from primary
const theme = createTheme(base, {
  palette: {
    brand: {
      overlayStart: alpha(base.palette.primary.main, 0.82),
      overlayEnd:   alpha('#0a2850', 0.90),
      panelText:    '#ffffff',
      panelTextMuted:  alpha('#ffffff', 0.75),
      panelTextFaint:  alpha('#ffffff', 0.50),
      panelDivider:    alpha('#ffffff', 0.40),
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
})

export default theme
