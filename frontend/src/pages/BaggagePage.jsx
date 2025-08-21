import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from '@mui/material'

export default function BaggagePage() {
  const [baggage, setBaggage] = useState([])
  const [flights, setFlights] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ tagNumber: '', flightId: '' })

  const load = async () => {
    const [{ data: bags }, { data: fls }] = await Promise.all([
      axios.get('/api/baggage'),
      axios.get('/api/flights')
    ])
    setBaggage(bags)
    setFlights(fls)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    await axios.post('/api/baggage', form)
    setOpen(false)
    setForm({ tagNumber: '', flightId: '' })
    load()
  }

  const update = async (id, data) => {
    await axios.put(`/api/baggage/${id}/status`, data)
    load()
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Baggage</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Baggage</Button>
      </Box>
      <Grid container spacing={2}>
        {baggage.map(b => (
          <Grid item xs={12} md={6} lg={4} key={b._id}>
            <Box p={2} border={1} borderColor="#eee" borderRadius={2}>
              <Typography variant="subtitle1">{b.tagNumber}</Typography>
              <TextField size="small" select label="Flight" value={b.flightId || ''} onChange={(e) => update(b._id, { flightId: e.target.value })} fullWidth sx={{ mt: 1 }}>
                <MenuItem value="">Unassigned</MenuItem>
                {flights.map(f => <MenuItem key={f._id} value={f._id}>{f.flightNumber}</MenuItem>)}
              </TextField>
              <TextField size="small" select label="Status" value={b.status} onChange={(e) => update(b._id, { status: e.target.value })} fullWidth sx={{ mt: 1 }}>
                {['AT_CHECKIN','LOADED','IN_TRANSIT','UNLOADED','AT_BELT'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Baggage</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Tag Number" margin="dense" value={form.tagNumber} onChange={(e) => setForm({ ...form, tagNumber: e.target.value })} />
          <TextField fullWidth select label="Flight" margin="dense" value={form.flightId} onChange={(e) => setForm({ ...form, flightId: e.target.value })}>
            <MenuItem value="">Unassigned</MenuItem>
            {flights.map(f => <MenuItem key={f._id} value={f._id}>{f.flightNumber}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

