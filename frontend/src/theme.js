import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#fb8c00' },
		secondary: { main: '#ffb74d' },
		background: {
			default: '#fff7ef',
			paper: '#ffffff',
		},
		success: { main: '#43a047' },
		info: { main: '#29b6f6' },
		warning: { main: '#f57c00' },
		error: { main: '#e53935' },
	},
	shape: { borderRadius: 12 },
	components: {
		MuiAppBar: {
			styleOverrides: {
				colorPrimary: { background: 'linear-gradient(90deg, #fb8c00, #f57c00)' },
			},
		},
		MuiButton: {
			styleOverrides: { root: { textTransform: 'none', borderRadius: 10 } },
		},
		MuiDrawer: {
			styleOverrides: { paper: { background: '#fffaf3' } },
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					'&.Mui-selected': { backgroundColor: 'rgba(251,140,0,0.15)' },
					'&.Mui-selected:hover': { backgroundColor: 'rgba(251,140,0,0.25)' },
				},
			},
		},
	},
	typography: {
		fontFamily: "'Open Sans', Helvetica, Arial, sans-serif",
		h6: { fontWeight: 700 },
	},
});

export default theme;