import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Alert, Box, Card, CardContent, Grid, Typography, Chip, Stack } from '@mui/material'

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
      {flights.map((f) => (
        <Grid item xs={12} md={6} lg={4} key={f._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{f.flightNumber} — {f.airline}</Typography>
              <Typography variant="body2">Gate: <b>{f.gate || '-'}</b></Typography>
              <Typography variant="body2">Scheduled: {new Date(f.scheduledTime).toLocaleString()}</Typography>
              <Chip label={f.status} color={f.status === 'DELAYED' ? 'warning' : f.status === 'BOARDING' ? 'info' : f.status === 'DEPARTED' ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
              <Box mt={1}>
                <Typography variant="subtitle2">Baggage:</Typography>
                {((baggageByFlight[f._id] || []).slice(0, 5)).map(b => (
                  <Chip key={b._id} label={`${b.tagNumber} — ${b.status}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

