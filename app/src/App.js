// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import EmployeeForm from './components/EmployeeForm';
// import EmployeeTable from './components/EmployeeTable';

// function App() {
//   const [formData, setFormData] = useState({ name: '', email: '', department: '' });
//   const [employees, setEmployees] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (editIndex !== null) {
//       const updated = [...employees];
//       updated[editIndex] = formData;
//       setEmployees(updated);
//       setEditIndex(null);
//     } else {
//       setEmployees([...employees, formData]);
//     }

//     setFormData({ name: '', email: '', department: '' });
//   };

//   const handleEdit = (index) => {
//     setFormData(employees[index]);
//     setEditIndex(index);
//   };

//   const handleDelete = (index) => {
//     const filtered = employees.filter((_, i) => i !== index);
//     setEmployees(filtered);

//     if (editIndex === index) {
//       setFormData({ name: '', email: '', department: '' });
//       setEditIndex(null);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Employee Manager</h2>

//       <EmployeeForm
//         formData={formData}
//         onChange={handleChange}
//         onSubmit={handleSubmit}
//         isEditing={editIndex !== null}
//       />

//       {employees.length > 0 && (
//         <EmployeeTable
//           employees={employees}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import EmployeeForm from './components/EmployeeForm';
// import EmployeeTable from './components/EmployeeTable';

// function App() {
//   const [formData, setFormData] = useState({ name: '', email: '', department: '' });
//   const [employees, setEmployees] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);

//   // Fetch employees from backend
//   useEffect(() => {
//     axios.get('http://localhost:4000/api/employees')
//       .then(res => setEmployees(res.data))
//       .catch(err => console.error('Error fetching employees:', err));
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submit
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (editIndex !== null) {
//       // PUT to update
//       axios.put(`http://localhost:4000/api/employees/${editIndex}`, formData)
//         .then(() => {
//           const updated = [...employees];
//           updated[editIndex] = formData;
//           setEmployees(updated);
//           setEditIndex(null);
//           setFormData({ name: '', email: '', department: '' });
//         })
//         .catch(err => console.error('Error updating employee:', err));
//     } else {
//       // POST to add
//       axios.post('http://localhost:4000/api/employees', formData)
//         .then((res) => {
//           setEmployees([...employees, res.data.data]);
//           setFormData({ name: '', email: '', department: '' });
//         })
//         .catch(err => console.error('Error adding employee:', err));
//     }
//   };

//   // Handle edit
//   const handleEdit = (index) => {
//     setFormData(employees[index]);
//     setEditIndex(index);
//   };

//   // Handle delete
//   const handleDelete = (index) => {
//     axios.delete(`http://localhost:4000/api/employees/${index}`)
//       .then(() => {
//         const filtered = employees.filter((_, i) => i !== index);
//         setEmployees(filtered);
//         if (editIndex === index) {
//           setFormData({ name: '', email: '', department: '' });
//           setEditIndex(null);
//         }
//       })
//       .catch(err => console.error('Error deleting employee:', err));
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Employee Manager</h2>

//       <EmployeeForm
//         formData={formData}
//         onChange={handleChange}
//         onSubmit={handleSubmit}
//         isEditing={editIndex !== null}
//       />

//       {employees.length > 0 && (
//         <EmployeeTable
//           employees={employees}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import EmployeeForm from './components/EmployeeForm';
// import EmployeeTable from './components/EmployeeTable';

// function App() {
//   const [formData, setFormData] = useState({ name: '', email: '', department: '' });
//   const [employees, setEmployees] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [searchId, setSearchId] = useState('');
//   const [searchedEmployee, setSearchedEmployee] = useState(null);

//   // Fetch all employees
//   useEffect(() => {
//     axios.get('http://localhost:4000/api/employees')
//       .then(res => setEmployees(res.data))
//       .catch(err => console.error('Error fetching employees:', err));
//   }, []);

//   // Handle input changes for form
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission (Add or Edit)
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (editIndex !== null) {
//       // Update existing employee
//       axios.put(`http://localhost:4000/api/employees/${editIndex}`, formData)
//         .then(() => {
//           const updated = [...employees];
//           updated[editIndex] = formData;
//           setEmployees(updated);
//           setEditIndex(null);
//           setFormData({ name: '', email: '', department: '' });
//         })
//         .catch(err => console.error('Error updating employee:', err));
//     } else {
//       // Add new employee
//       axios.post('http://localhost:4000/api/employees', formData)
//         .then((res) => {
//           setEmployees([...employees, res.data.data]);
//           setFormData({ name: '', email: '', department: '' });
//         })
//         .catch(err => console.error('Error adding employee:', err));
//     }
//   };

//   // Handle edit button click
//   const handleEdit = (index) => {
//     setFormData(employees[index]);
//     setEditIndex(index);
//   };

//   // Handle delete button click
//   const handleDelete = (index) => {
//     axios.delete(`http://localhost:4000/api/employees/${index}`)
//       .then(() => {
//         const filtered = employees.filter((_, i) => i !== index);
//         setEmployees(filtered);
//         if (editIndex === index) {
//           setFormData({ name: '', email: '', department: '' });
//           setEditIndex(null);
//         }
//       })
//       .catch(err => console.error('Error deleting employee:', err));
//   };

//   // Handle single employee search
//   const handleSearch = () => {
//     if (searchId === '') return;

//     axios.get(`http://localhost:4000/api/employees/${searchId}`)
//       .then(res => setSearchedEmployee(res.data))
//       .catch(err => {
//         console.error('Error fetching employee by ID:', err);
//         setSearchedEmployee(null);
//       });
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Employee Manager</h2>

//       {/* Search Employee by ID */}
//       <div className="mb-4">
//         <input
//           type="number"
//           placeholder="Search by index (e.g., 0)"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           style={{ marginRight: 10 }}
//         />
//         <button onClick={handleSearch} className="btn btn-secondary">Search Employee</button>
//       </div>

//       {/* Show searched employee */}
//       {searchedEmployee && (
//         <div className="alert alert-info">
//           <strong>Found Employee:</strong><br />
//           Name: {searchedEmployee.name}<br />
//           Email: {searchedEmployee.email}<br />
//           Department: {searchedEmployee.department}
//         </div>
//       )}

//       {/* Employee Form */}
//       <EmployeeForm
//         formData={formData}
//         onChange={handleChange}
//         onSubmit={handleSubmit}
//         isEditing={editIndex !== null}
//       />

//       {/* Employee Table */}
//       {employees.length > 0 && (
//         <EmployeeTable
//           employees={employees}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchedEmployee, setSearchedEmployee] = useState(null);

  // Fetch all employees
  useEffect(() => {
    axios.get('http://localhost:4000/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Error fetching employees:', err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add/update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // Update
      axios.put(`http://localhost:4000/api/employees/${editId}`, formData)
        .then((res) => {
          setEmployees((prev) =>
            prev.map((emp) => (emp._id === editId ? res.data.data : emp))
          );
          resetForm();
        })
        .catch(err => console.error('Error updating employee:', err));
    } else {
      // Add
      axios.post('http://localhost:4000/api/employees', formData)
        .then((res) => {
          setEmployees([...employees, res.data.data]);
          resetForm();
        })
        .catch(err => console.error('Error adding employee:', err));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '' });
    setEditId(null);
  };

  // Handle edit
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department
    });
    setEditId(employee._id);
  };

  // Handle delete
  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp._id !== id));
        if (editId === id) resetForm();
      })
      .catch(err => console.error('Error deleting employee:', err));
  };

  // Search employee by MongoDB _id
  const handleSearch = () => {
    if (!searchId) return;

    axios.get(`http://localhost:4000/api/employees/${searchId}`)
      .then(res => setSearchedEmployee(res.data))
      .catch(err => {
        console.error('Error fetching employee by ID:', err);
        setSearchedEmployee(null);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employee Manager</h2>

      {/* Search by MongoDB ID */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by MongoDB _id"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ marginRight: 10 }}
          className="form-control d-inline-block w-auto"
        />
        <button onClick={handleSearch} className="btn btn-secondary">Search Employee</button>
      </div>

      {/* Show searched employee */}
      {searchedEmployee && (
        <div className="alert alert-info">
          <strong>Found Employee:</strong><br />
          Name: {searchedEmployee.name}<br />
          Email: {searchedEmployee.email}<br />
          Department: {searchedEmployee.department}
        </div>
      )}

      {/* Employee Form */}
      <EmployeeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEditing={!!editId}
      />

      {/* Employee Table */}
      {employees.length > 0 && (
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
