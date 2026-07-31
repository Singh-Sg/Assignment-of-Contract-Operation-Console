import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { STATUS_LABELS } from '../../utils/constants';

const STATUS_KEY_MAP = {
  DRAFT: 'draft',
  FINALIZED: 'finalized',
  ARCHIVED: 'archived',
};

export default function StatusChip({ status, size = 'small' }) {
  const theme = useTheme();
  const key = STATUS_KEY_MAP[status] || 'draft';
  const color = theme.palette.contractStatus[key];
  const bgColor = theme.palette.contractStatus[`${key}Bg`];

  return (
    <Chip
      label={STATUS_LABELS[status] || status}
      size={size}
      sx={{
        color,
        backgroundColor: bgColor,
        border: `1px solid ${color}33`,
      }}
    />
  );
}
