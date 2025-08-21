import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from '@mui/material'

export default function FlightsPage() {
  const [flights, setFlights] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ flightNumber: '', airline: '', gate: '', status: 'SCHEDULED', scheduledTime: '' })

  const load = async () => {
    const { data } = await axios.get('/api/flights')
    setFlights(data)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    const payload = { ...form, scheduledTime: new Date(form.scheduledTime).toISOString() }
    await axios.post('/api/flights', payload)
    setOpen(false)
    setForm({ flightNumber: '', airline: '', gate: '', status: 'SCHEDULED', scheduledTime: '' })
    load()
  }

  const update = async (id, data) => {
    await axios.put(`/api/flights/${id}`, data)
    load()
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Flights</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create Flight</Button>
      </Box>
      <Grid container spacing={2}>
        {flights.map(f => (
          <Grid item xs={12} md={6} lg={4} key={f._id}>
            <Box p={2} border={1} borderColor="#eee" borderRadius={2}>
              <Typography variant="subtitle1">{f.flightNumber} — {f.airline}</Typography>
              <TextField size="small" label="Gate" value={f.gate || ''} onChange={(e) => update(f._id, { gate: e.target.value })} fullWidth sx={{ mt: 1 }} />
              <TextField size="small" select label="Status" value={f.status} onChange={(e) => update(f._id, { status: e.target.value })} fullWidth sx={{ mt: 1 }}>
                {['SCHEDULED','BOARDING','DELAYED','DEPARTED','CANCELLED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              <TextField size="small" label="Scheduled" type="datetime-local" value={new Date(f.scheduledTime).toISOString().slice(0,16)} onChange={(e) => update(f._id, { scheduledTime: new Date(e.target.value).toISOString() })} fullWidth sx={{ mt: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Flight</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Flight Number" margin="dense" value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
          <TextField fullWidth label="Airline" margin="dense" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
          <TextField fullWidth label="Gate" margin="dense" value={form.gate} onChange={(e) => setForm({ ...form, gate: e.target.value })} />
          <TextField fullWidth select label="Status" margin="dense" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['SCHEDULED','BOARDING','DELAYED','DEPARTED','CANCELLED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Scheduled Time" type="datetime-local" margin="dense" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

