import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const BaggageOps = () => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6" sx={{ fontWeight: 700 }}>Baggage Operations</Typography>
				<Typography color="text.secondary">Update baggage status and assign to flights (baggage).</Typography>
			</CardContent>
		</Card>
	);
};

export default BaggageOps;