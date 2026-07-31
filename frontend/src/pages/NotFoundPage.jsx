import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '4rem', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 420 }}>
        The page you're looking for doesn't exist or may have been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </Box>
  );
}
