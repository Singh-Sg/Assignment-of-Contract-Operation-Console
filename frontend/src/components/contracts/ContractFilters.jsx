import { useState } from 'react';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { CONTRACT_STATUSES, STATUS_LABELS } from '../../utils/constants';

export default function ContractFilters({ search, status, onSearchChange, onStatusChange }) {
  const [searchInput, setSearchInput] = useState(search);

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    clearTimeout(handleSearchInput._timer);
    handleSearchInput._timer = setTimeout(() => onSearchChange(value), 400);
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        placeholder="Search by client name or contract ID"
        value={searchInput}
        onChange={handleSearchInput}
        size="small"
        sx={{ flex: 1, minWidth: 260 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        select
        label="Status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        size="small"
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">All statuses</MenuItem>
        {CONTRACT_STATUSES.map((value) => (
          <MenuItem key={value} value={value}>
            {STATUS_LABELS[value]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
