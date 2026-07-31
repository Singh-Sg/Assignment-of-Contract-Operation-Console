import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ label = 'Loading…', minHeight = 240, size = 40 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight,
        width: '100%',
      }}
    >
      <CircularProgress size={size} thickness={4} />
      {label ? (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      ) : null}
    </Box>
  );
}
