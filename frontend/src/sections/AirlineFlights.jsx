import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const AirlineFlights = () => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6" sx={{ fontWeight: 700 }}>Flights</Typography>
				<Typography color="text.secondary">Create/update flights and set gates (airline).</Typography>
			</CardContent>
		</Card>
	);
};

export default AirlineFlights;