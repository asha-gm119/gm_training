const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./Routes/employeeRoutes.js');

const app = express();
const PORT = 4000;
app.use(cors());      
app.use(express.json());


app.use('/api/employees', employeeRoutes);

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
