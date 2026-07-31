import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import { useOrganization } from '../context/OrganizationContext';
import { useRealtime } from '../context/RealtimeContext';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Contracts', path: '/contracts', icon: <DescriptionRoundedIcon /> },
  { label: 'New Contract', path: '/contracts/new', icon: <AddRoundedIcon /> },
];

const CONNECTION_META = {
  connected: { label: 'Live', color: 'success.main' },
  connecting: { label: 'Connecting…', color: 'warning.main' },
  disconnected: { label: 'Offline', color: 'text.disabled' },
};

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgMenuAnchor, setOrgMenuAnchor] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { organization, clearOrganization } = useOrganization();
  const { connectionStatus } = useRealtime();

  const handleSwitchOrganization = () => {
    setOrgMenuAnchor(null);
    clearOrganization();
    navigate('/');
  };

  const connectionMeta = CONNECTION_META[connectionStatus] || CONNECTION_META.disconnected;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DescriptionRoundedIcon sx={{ color: 'common.white', fontSize: 18 }} />
          </Box>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
            Contract Ops
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected =
            item.path === '/contracts'
              ? location.pathname.startsWith('/contracts') && location.pathname !== '/contracts/new'
              : location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '& .MuiListItemIcon-root': { color: 'common.white' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {item.label}
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FiberManualRecordRoundedIcon sx={{ fontSize: 12, color: connectionMeta.color }} />
          <Typography variant="caption" color="text.secondary">
            {connectionMeta.label}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: 'pointer', borderRadius: 2, px: 1, py: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
            onClick={(event) => setOrgMenuAnchor(event.currentTarget)}
          >
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: '0.85rem' }}>
              <BusinessRoundedIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 180 }} noWrap>
              {organization?.name || 'No organization'}
            </Typography>
            <ExpandMoreRoundedIcon fontSize="small" />
          </Stack>
          <Menu
            anchorEl={orgMenuAnchor}
            open={Boolean(orgMenuAnchor)}
            onClose={() => setOrgMenuAnchor(null)}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Chip size="small" label={connectionMeta.label} sx={{ color: connectionMeta.color }} />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSwitchOrganization}>Switch organization</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          p: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
