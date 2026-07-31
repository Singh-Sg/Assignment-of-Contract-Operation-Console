import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme/theme';
import { OrganizationProvider } from './context/OrganizationContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <OrganizationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </OrganizationProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
