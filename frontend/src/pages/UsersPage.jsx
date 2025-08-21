import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'AIRLINE' })

  const load = async () => {
    const { data } = await axios.get('/api/users')
    setUsers(data)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    await axios.post('/api/users', form)
    setOpen(false)
    setForm({ name: '', email: '', password: '', role: 'AIRLINE' })
    load()
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Users</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create User</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u._id || u.email}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Email" margin="dense" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="dense" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField fullWidth select label="Role" margin="dense" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="AIRLINE">AIRLINE</MenuItem>
            <MenuItem value="BAGGAGE">BAGGAGE</MenuItem>
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

