import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Alert, Box, Grid, Typography, Chip, Stack } from '@mui/material'
import KPI from '../components/widgets/KPI.jsx'
import TrendChart from '../components/widgets/TrendChart.jsx'
import ListCard from '../components/widgets/ListCard.jsx'

export default function Dashboard() {
  const [flights, setFlights] = useState([])
  const [baggageByFlight, setBaggageByFlight] = useState({})
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data: flightsData } = await axios.get('/api/flights')
      setFlights(flightsData)
      const flightIds = flightsData.map(f => f._id)
      const baggagePromises = flightIds.map(id => axios.get('/api/baggage', { params: { flightId: id } }))
      const baggageResults = await Promise.all(baggagePromises)
      const map = {}
      flightsData.forEach((f, idx) => { map[f._id] = baggageResults[idx].data })
      setBaggageByFlight(map)
    }
    load()

    const socket = io(import.meta.env.VITE_WS_BASE || 'http://localhost:4000')
    socket.on('event', (evt) => {
      if (evt.topic === 'flight-events') {
        if (evt.type === 'flight-created') setFlights(prev => [evt.flight, ...prev])
        if (evt.type === 'flight-updated' || evt.type === 'flight-delayed') setFlights(prev => prev.map(f => f._id === evt.flight._id ? evt.flight : f))
        if (evt.type === 'flight-deleted') setFlights(prev => prev.filter(f => f._id !== evt.flightId))
      }
      if (evt.topic === 'baggage-events') {
        if (evt.type === 'baggage-created') setBaggageByFlight(prev => ({ ...prev, [evt.baggage.flightId]: [...(prev[evt.baggage.flightId] || []), evt.baggage] }))
        if (evt.type === 'baggage-updated') setBaggageByFlight(prev => ({ ...prev, [evt.baggage.flightId]: (prev[evt.baggage.flightId] || []).map(b => b._id === evt.baggage._id ? evt.baggage : b) }))
        if (evt.type === 'baggage-deleted') setBaggageByFlight(prev => {
          const newMap = { ...prev }
          for (const k of Object.keys(newMap)) newMap[k] = newMap[k].filter(b => b._id !== evt.baggageId)
          return newMap
        })
      }
    })
    socket.on('notification', (note) => {
      setNotifications(prev => [note, ...prev].slice(0, 5))
    })
    return () => socket.close()
  }, [])

  const kpis = [
    { title: 'Active Flights', value: flights.filter(f => ['SCHEDULED','BOARDING','DELAYED'].includes(f.status)).length, color: 'primary.main' },
    { title: 'Departed Today', value: flights.filter(f => f.status==='DEPARTED').length, color: 'success.main' },
    { title: 'Delayed', value: flights.filter(f => f.status==='DELAYED').length, color: 'warning.main' },
    { title: 'Baggage In Transit', value: Object.values(baggageByFlight).flat().filter(b => b.status==='IN_TRANSIT').length, color: 'info.main' },
  ]

  const trendData = flights.slice(0, 10).map((f, idx) => ({ name: f.flightNumber, value: (baggageByFlight[f._id]||[]).length || 0 }))

  const recentFlights = flights.slice(0, 5).map(f => ({ title: `${f.flightNumber} — ${f.airline}`, subtitle: `Gate ${f.gate || '-'} • ${new Date(f.scheduledTime).toLocaleTimeString()}` }))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          {notifications.map(n => (
            <Alert key={n._id} severity={n.type === 'FLIGHT_DELAY' ? 'warning' : 'info'}>
              {n.message}
            </Alert>
          ))}
        </Stack>
      </Grid>

      {kpis.map((k, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}><KPI title={k.title} value={k.value} color={k.color} /></Grid>
      ))}

      <Grid item xs={12} md={8}><TrendChart title="Baggage by Flight" data={trendData} /></Grid>
      <Grid item xs={12} md={4}><ListCard title="Recent Flights" items={recentFlights} /></Grid>

      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 1 }}>Flights</Typography>
        <Grid container spacing={2}>
          {flights.map((f) => (
            <Grid item xs={12} md={6} lg={4} key={f._id}>
              <Box p={2} border={1} borderColor="#eee" borderRadius={2}>
                <Typography variant="subtitle1">{f.flightNumber} — {f.airline}</Typography>
                <Typography variant="body2">Gate: <b>{f.gate || '-'}</b></Typography>
                <Typography variant="body2">Scheduled: {new Date(f.scheduledTime).toLocaleString()}</Typography>
                <Chip label={f.status} color={f.status === 'DELAYED' ? 'warning' : f.status === 'BOARDING' ? 'info' : f.status === 'DEPARTED' ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
                <Box mt={1}>
                  <Typography variant="subtitle2">Baggage:</Typography>
                  {((baggageByFlight[f._id] || []).slice(0, 5)).map(b => (
                    <Chip key={b._id} label={`${b.tagNumber} — ${b.status}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

