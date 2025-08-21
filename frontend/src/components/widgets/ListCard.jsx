import React from 'react'
import { Avatar, Card, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'

export default function ListCard({ title, items }) {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography>
        <Divider />
        <List>
          {items.map((it, idx) => (
            <ListItem key={idx} divider>
              <ListItemAvatar>
                <Avatar>{it.avatar || it.title?.[0] || '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={it.title} secondary={it.subtitle} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

