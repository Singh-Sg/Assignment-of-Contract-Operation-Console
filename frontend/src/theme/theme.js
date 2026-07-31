import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1F3A5F',
      light: '#3D5A80',
      dark: '#132840',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0E8388',
      light: '#3EACAF',
      dark: '#0A5F63',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2027',
      secondary: '#5B6572',
    },
    success: {
      main: '#1E8E5A',
      light: '#E6F4EC',
    },
    warning: {
      main: '#B7791F',
      light: '#FBF0DD',
    },
    error: {
      main: '#C0362C',
      light: '#FBEAE9',
    },
    info: {
      main: '#2B6CB0',
      light: '#E8F1FA',
    },
    divider: '#E3E8EF',
    contractStatus: {
      draft: '#B7791F',
      draftBg: '#FBF0DD',
      finalized: '#1E8E5A',
      finalizedBg: '#E6F4EC',
      archived: '#5B6572',
      archivedBg: '#EDEFF2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.1rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, fontSize: '0.85rem', color: '#5B6572' },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.85rem' },
    button: { fontWeight: 600, textTransform: 'none' },
    caption: { fontSize: '0.75rem' },
    monospace: {
      fontFamily: '"IBM Plex Mono", monospace',
    },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F7FA',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E3E8EF',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 16,
          paddingRight: 16,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#F5F7FA',
          color: '#5B6572',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E3E8EF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E3E8EF',
        },
      },
    },
  },
});

export default theme;
