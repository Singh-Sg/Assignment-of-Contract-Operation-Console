import { Avatar, Box, Card, CardContent, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../common/StatusChip';
import EmptyState from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

export default function RecentActivity({ activity = [] }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Recent Activity" subheader="Latest contract status and edits" />
      <CardContent sx={{ pt: 0 }}>
        {activity.length === 0 ? (
          <EmptyState
            title="No recent activity"
            message="Activity will appear here as contracts are created and updated."
            minHeight={180}
            icon={<HistoryRoundedIcon sx={{ fontSize: 36, color: 'text.secondary' }} />}
          />
        ) : (
          <List disablePadding>
            {activity.map((item) => (
              <ListItem
                key={item.id || `${item.contractId}-${item.timestamp}`}
                onClick={() => navigate(`/contracts/${item.id}`)}
                sx={{
                  px: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <HistoryRoundedIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.field_data?.client_name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Contract #{item.id}
                      </Typography>

                      <Box sx={{ flex: 1 }} />

                      <StatusChip status={item.status} />
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Updated • {formatDateTime(item.updated_at)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
