import React, { useMemo, useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import { Menu as MenuIcon, Analytics as AnalyticsIcon, Luggage as LuggageIcon, Flight as FlightIcon, Group as GroupIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../state/AuthContext.jsx';
import AnalyticsPanel from '../sections/AnalyticsPanel.jsx';
import AdminUsers from '../sections/AdminUsers.jsx';
import AirlineFlights from '../sections/AirlineFlights.jsx';
import BaggageOps from '../sections/BaggageOps.jsx';

const drawerWidth = 240;

const Dashboard = () => {
	const { user, logout } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [active, setActive] = useState('analytics');

	const menu = useMemo(() => {
		const base = [{ key: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> }];
		if (user?.role === 'ADMIN') {
			base.push({ key: 'users', label: 'Manage Users', icon: <GroupIcon /> });
		}
		if (user?.role === 'AIRLINE') {
			base.push({ key: 'flights', label: 'Flights', icon: <FlightIcon /> });
		}
		if (user?.role === 'BAGGAGE') {
			base.push({ key: 'baggage', label: 'Baggage Ops', icon: <LuggageIcon /> });
		}
		return base;
	}, [user]);

	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{menu.map((item) => (
					<ListItemButton key={item.key} selected={active === item.key} onClick={() => setActive(item.key)}>
						<ListItemIcon>{item.icon}</ListItemIcon>
						<ListItemText primary={item.label} />
					</ListItemButton>
				))}
			</List>
		</div>
	);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
						SkyTrack Dashboard — {user?.role}
					</Typography>
					<Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>Logout</Button>
				</Toolbar>
			</AppBar>
			<Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }}
				sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
				{drawer}
			</Drawer>
			<Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }} open>
				{drawer}
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{active === 'analytics' && <AnalyticsPanel />}
				{active === 'users' && user?.role === 'ADMIN' && <AdminUsers />}
				{active === 'flights' && user?.role === 'AIRLINE' && <AirlineFlights />}
				{active === 'baggage' && user?.role === 'BAGGAGE' && <BaggageOps />}
			</Box>
		</Box>
	);
};

export default Dashboard;