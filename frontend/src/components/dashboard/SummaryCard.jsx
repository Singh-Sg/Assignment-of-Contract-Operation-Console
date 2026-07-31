import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { formatNumber } from '../../utils/formatters';

export default function SummaryCard({ label, value, icon, accentColor = 'primary.main' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h2" sx={{ mt: 1 }}>
              {formatNumber(value ?? 0)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${accentColor}1A`,
              color: accentColor,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
