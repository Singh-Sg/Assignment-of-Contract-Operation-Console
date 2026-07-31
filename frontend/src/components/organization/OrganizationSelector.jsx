import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useOrganization } from '../../context/OrganizationContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorState from '../common/ErrorState';

export default function OrganizationSelector() {
  const { organizations, loading, error, refetch } = useOrganizations();
  const { organization, selectOrganization } = useOrganization();
  const [pending, setPending] = useState(organization || null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!pending) return;
    selectOrganization(pending);
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={0.5} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <BusinessRoundedIcon sx={{ color: 'common.white' }} />
            </Box>
            <Typography variant="h3" align="center">
              Contract Operations Console
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Select an organization to continue
            </Typography>
          </Stack>

          {loading ? (
            <LoadingSpinner label="Loading organizations…" minHeight={140} />
          ) : error ? (
            <ErrorState
              title="Could not load organizations"
              message={error}
              onRetry={refetch}
              minHeight={140}
            />
          ) : (
            <Stack spacing={3}>
              <Autocomplete
                options={organizations}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={pending}
                onChange={(_event, value) => setPending(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Organization" placeholder="Search organizations" />
                )}
              />
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                disabled={!pending}
                onClick={handleContinue}
                fullWidth
              >
                Continue
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
