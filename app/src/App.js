import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
  const [employees, setEmployees] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...employees];
      updated[editIndex] = formData;
      setEmployees(updated);
      setEditIndex(null);
    } else {
      setEmployees([...employees, formData]);
    }

    setFormData({ name: '', email: '', department: '' });
  };

  const handleEdit = (index) => {
    setFormData(employees[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filtered = employees.filter((_, i) => i !== index);
    setEmployees(filtered);

    if (editIndex === index) {
      setFormData({ name: '', email: '', department: '' });
      setEditIndex(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employee Manager</h2>

      <EmployeeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEditing={editIndex !== null}
      />

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
