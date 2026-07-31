import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this data. Please try again.',
  onRetry,
  minHeight = 240,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1,
        minHeight,
        px: 3,
      }}
    >
      <ErrorOutlineRoundedIcon sx={{ fontSize: 40, color: 'error.main' }} />
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        {message}
      </Typography>
      {onRetry ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
      ) : null}
    </Box>
  );
}
