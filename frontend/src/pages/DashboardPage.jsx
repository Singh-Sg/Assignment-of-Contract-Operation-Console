import { Button, Grid } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import ErrorState from '../components/common/ErrorState';
import { SummaryCardSkeleton } from '../components/common/SkeletonLoader';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useOrganization } from '../context/OrganizationContext';

export default function DashboardPage() {
  const { organization } = useOrganization();
  const { summary, recentActivity, loading, error, refetch } = useDashboardSummary();
  const navigate = useNavigate();

  if (error) {
    return <ErrorState message={error} onRetry={refetch} minHeight={400} />;
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={organization ? `Overview for ${organization.name}` : 'Overview'}
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate('/contracts/new')}
          >
            New Contract
          </Button>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <SummaryCardSkeleton />
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Total Contracts"
                value={summary?.total}
                icon={<DescriptionRoundedIcon />}
                accentColor="#1F3A5F"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Draft Contracts"
                value={summary?.draft}
                icon={<EditNoteRoundedIcon />}
                accentColor="#B7791F"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Finalized Contracts"
                value={summary?.finalized}
                icon={<CheckCircleRoundedIcon />}
                accentColor="#1E8E5A"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Archived Contracts"
                value={summary?.archived}
                icon={<ArchiveRoundedIcon />}
                accentColor="#5B6572"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <RecentActivity activity={loading ? [] : recentActivity} />
        </Grid>
      </Grid>
    </>
  );
}
