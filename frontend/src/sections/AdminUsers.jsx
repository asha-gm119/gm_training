import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const AdminUsers = () => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6" sx={{ fontWeight: 700 }}>Manage Users</Typography>
				<Typography color="text.secondary">Create/list users here (admin only).</Typography>
			</CardContent>
		</Card>
	);
};

export default AdminUsers;