import { Box, Button, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'There is no data to display.',
  actionLabel,
  onAction,
  icon,
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
      {icon || <InboxRoundedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />}
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        {message}
      </Typography>
      {actionLabel && onAction ? (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
}
