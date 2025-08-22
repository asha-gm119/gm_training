import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Grid, Typography, Chip, Box } from '@mui/material';
import { FlightTakeoff, WarningAmber, Luggage, CheckCircle } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '../api/client';

const StatCard = ({ title, value, icon, color }) => (
	<Card elevation={2} sx={{ background: '#ffffff' }}>
		<CardContent>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Box>
					<Typography variant="subtitle2" color="text.secondary">{title}</Typography>
					<Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
				</Box>
				<Box sx={{ bgcolor: `${color}.main`, color: 'white', p: 1.2, borderRadius: 2, display: 'flex' }}>
					{icon}
				</Box>
			</Box>
		</CardContent>
	</Card>
);

const ORANGE_GRADIENT = ["#fb8c00", "#f57c00", "#ffb74d"]; // primary to warm light

const AnalyticsPanel = () => {
	const [summary, setSummary] = useState({ activeFlights: 0, delayedFlights: 0, bagsTransit: 0, bagsAtBelt: 0 });
	const [series, setSeries] = useState([]);
	const [baggageBreakdown, setBaggageBreakdown] = useState([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const [sumRes, tsRes, bagRes] = await Promise.all([
					api.client.get('/analytics/summary').catch(() => null),
					api.client.get('/analytics/timeseries').catch(() => null),
					api.client.get('/analytics/baggage-breakdown').catch(() => null),
				]);
				if (!mounted) return;
				if (sumRes?.data) setSummary(sumRes.data);
				else setSummary({ activeFlights: 12, delayedFlights: 3, bagsTransit: 420, bagsAtBelt: 180 });
				if (tsRes?.data) setSeries(tsRes.data);
				else setSeries([
					{ time: '08:00', active: 6, delayed: 1 },
					{ time: '09:00', active: 9, delayed: 2 },
					{ time: '10:00', active: 12, delayed: 2 },
					{ time: '11:00', active: 14, delayed: 3 },
					{ time: '12:00', active: 11, delayed: 2 },
				]);
				if (bagRes?.data) setBaggageBreakdown(bagRes.data);
				else setBaggageBreakdown([
					{ name: 'At Check-in', value: 160 },
					{ name: 'Loaded', value: 220 },
					{ name: 'In Transit', value: 420 },
					{ name: 'Unloaded', value: 200 },
					{ name: 'At Belt', value: 180 },
				]);
			} catch (_) {}
		})();
		return () => { mounted = false };
	}, []);

	const pieColors = useMemo(() => ["#fb8c00", "#f57c00", "#ff9800", "#ffb74d", "#ffe0b2"], []);

	return (
		<Box>
			<Grid container spacing={2}>
				<Grid item xs={12} md={3}>
					<StatCard title="Active Flights" value={summary.activeFlights} icon={<FlightTakeoff />} color="primary" />
				</Grid>
				<Grid item xs={12} md={3}>
					<StatCard title="Delayed Flights" value={summary.delayedFlights} icon={<WarningAmber />} color="warning" />
				</Grid>
				<Grid item xs={12} md={3}>
					<StatCard title="Bags In Transit" value={summary.bagsTransit} icon={<Luggage />} color="primary" />
				</Grid>
				<Grid item xs={12} md={3}>
					<StatCard title="Bags At Belt" value={summary.bagsAtBelt} icon={<CheckCircle />} color="success" />
				</Grid>
			</Grid>

			<Grid container spacing={2} sx={{ mt: 1 }}>
				<Grid item xs={12} md={7}>
					<Card elevation={2}>
						<CardContent>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Flight Activity (Today)</Typography>
							<Box sx={{ height: 280 }}>
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={series} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
										<defs>
											<linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0%" stopColor="#fb8c00" stopOpacity={0.9} />
												<stop offset="100%" stopColor="#fb8c00" stopOpacity={0.1} />
											</linearGradient>
											<linearGradient id="gradDelayed" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0%" stopColor="#f57c00" stopOpacity={0.9} />
												<stop offset="100%" stopColor="#f57c00" stopOpacity={0.1} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="time" />
										<YAxis />
										<Tooltip />
										<Line type="monotone" dataKey="active" stroke="#fb8c00" strokeWidth={2} dot={false} />
										<Line type="monotone" dataKey="delayed" stroke="#f57c00" strokeWidth={2} dot={false} />
									</LineChart>
								</ResponsiveContainer>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} md={5}>
					<Card elevation={2}>
						<CardContent>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Baggage Breakdown</Typography>
							<Box sx={{ height: 280 }}>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie data={baggageBreakdown} dataKey="value" nameKey="name" outerRadius={100} innerRadius={50}>
											{baggageBreakdown.map((_, idx) => (
												<Cell key={`c-${idx}`} fill={pieColors[idx % pieColors.length]} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Grid container spacing={2} sx={{ mt: 1 }}>
				<Grid item xs={12}>
					<Card elevation={2}>
						<CardContent>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Baggage Throughput by Hour</Typography>
							<Box sx={{ height: 260 }}>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={series}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="time" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="active" fill="#fb8c00" radius={[6, 6, 0, 0]} />
										<Bar dataKey="delayed" fill="#f57c00" radius={[6, 6, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AnalyticsPanel;