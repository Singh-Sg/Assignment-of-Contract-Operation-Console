import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import { ListItemsSkeleton } from '../common/SkeletonLoader';
import StatusChip from '../common/StatusChip';
import { formatDateTime } from '../../utils/formatters';
import { AUDIT_EVENT_LABELS } from '../../utils/constants';

const DOT_COLOR_BY_EVENT = {
  CREATED: 'info',
  UPDATED: 'primary',
  STATUS_CHANGED: 'secondary',
  FINALIZED: 'success',
  ARCHIVED: 'grey',
  DELETED: 'error',
};

export default function AuditTimeline({ events, loading, error, onRetry }) {
  return (
    <Card>
      <CardHeader
        title="Audit History"
        subheader="Chronological record of contract events"
      />

      <CardContent>
        {loading ? (
          <ListItemsSkeleton items={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} minHeight={160} />
        ) : events.length === 0 ? (
          <EmptyState
            title="No audit events yet"
            message="Actions on this contract will be recorded here."
            minHeight={160}
            icon={<HistoryRoundedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />}
          />
        ) : (
          <Timeline
            sx={{
              p: 0,
              m: 0,
              '& .MuiTimelineItem-root:before': {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {events.map((event, index) => (
              <TimelineItem key={event.id || index}>
                <TimelineSeparator>
                  <TimelineDot
                    color={DOT_COLOR_BY_EVENT[event.event_type] || 'primary'}
                    sx={{
                      width: 16,
                      height: 16,
                      boxShadow: 2,
                    }}
                  />

                  {index < events.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700 }}
                  >
                    {AUDIT_EVENT_LABELS[event.event_type] || event.event_type}
                  </Typography>

                  {event.previousStatus || event.newStatus ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      {event.previousStatus && (
                        <StatusChip status={event.previousStatus} />
                      )}

                      {event.previousStatus && event.newStatus && (
                        <Typography color="text.secondary">→</Typography>
                      )}

                      {event.newStatus && (
                        <StatusChip status={event.newStatus} />
                      )}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {event.event_type === 'CREATED' &&
                        `Contract created for ${event.changes?.client_name}`}

                      {event.event_type === 'UPDATED' &&
                        'Contract details updated'}

                      {event.event_type === 'STATUS_CHANGED' &&
                        'Contract status changed'}

                      {event.event_type === 'FINALIZED' &&
                        'Contract finalized'}

                      {event.event_type === 'ARCHIVED' &&
                        'Contract archived'}

                      {event.event_type === 'DELETED' &&
                        'Contract deleted'}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      mt: 1,
                      
                    }}
                  >
                    {event.event_type === 'CREATED' && 'Contract Created at • '}
                    {event.event_type === 'UPDATED' && 'Contract Updated at • '}
                    {event.event_type === 'STATUS_CHANGED' && 'Status Changed at • '}
                    {event.event_type === 'FINALIZED' && 'Contract Finalized at • '}
                    {event.event_type === 'ARCHIVED' && 'Contract Archived at • '}
                    {event.event_type === 'DELETED' && 'Contract Deleted at • '}

                    {formatDateTime(event.event_time)}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>
    </Card>
  );
}