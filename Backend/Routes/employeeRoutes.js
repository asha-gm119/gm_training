// const express = require('express');
// const router = express.Router();

// let employees = [
//   {
//     name: 'Asha Latha',
//     email: 'asha@example.com',
//     department: 'Engineering',
//   },
//   {
//     name: 'Rahul Kumar',
//     email: 'rahul.k@example.com',
//     department: 'Marketing',
//   },
//   {
//     name: 'Priya Nair',
//     email: 'priya.nair@example.com',
//     department: 'HR',
//   }
// ];

// router.get('/', (req, res) => {
//   res.json(employees);
// });

// router.post('/', (req, res) => {
//   const newEmployee = req.body;
//   employees.push(newEmployee);
//   res.status(201).json({ message: 'Employee added', data: newEmployee });
// });

// router.get('/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   if (id >= 0 && id < employees.length) {
//     res.json(employees[id]);
//   } else {
//     res.status(404).json({ error: 'Employee not found' });
//   }
// });

// router.put('/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   if (id >= 0 && id < employees.length) {
//     employees[id] = req.body;
//     res.json({ message: 'Employee updated', data: employees[id] });
//   } else {
//     res.status(404).json({ error: 'Employee not found' });
//   }
// });


// router.delete('/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   if (id >= 0 && id < employees.length) {
//     const deleted = employees.splice(id, 1);
//     res.json({ message: 'Employee deleted', data: deleted[0] });
//   } else {
//     res.status(404).json({ error: 'Employee not found' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Employee = require('../Models/Employee.js');
const mongoose = require('mongoose');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.status(201).json({ message: 'Employee added', data: saved });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID format' });

  try {
    const emp = await Employee.findById(id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching employee' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID format' });

  try {
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee updated', data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID format' });

  try {
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted', data: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting employee' });
  }
});

module.exports = router;

