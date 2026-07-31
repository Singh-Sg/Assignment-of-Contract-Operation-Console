import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export function SummaryCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={44} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
}

export function TableRowsSkeleton({ rows = 6, columns = 6 }) {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rounded"
              height={28}
              sx={{ flex: colIndex === 0 ? '0 0 120px' : 1 }}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export function DetailsSkeleton() {
  return (
    <Stack spacing={3}>
      <Skeleton variant="rounded" height={120} />
      <Skeleton variant="rounded" height={180} />
      <Skeleton variant="rounded" height={260} />
    </Stack>
  );
}

export function ListItemsSkeleton({ items = 4 }) {
  return (
    <Box>
      {Array.from({ length: items }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={56} sx={{ mb: 1.5 }} />
      ))}
    </Box>
  );
}
