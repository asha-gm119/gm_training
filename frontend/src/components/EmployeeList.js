import React, { useEffect, useState } from 'react';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/api';
import EmployeeForm from './EmployeeForm';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [source, setSource] = useState(''); // <-- NEW

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchEmployees();
      console.log("Data source:", res.source); // console log for debugging
      setSource(res.source || ''); // <-- store it in state
      setEmployees(res.data || res);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createEmployee(payload);
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || 'Create failed');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateEmployee(editId, payload);
      setEditId(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || 'Delete failed');
    }
  };

  const startEdit = (emp) => {
    setEditId(emp._id);
    setEmployees((prev) => prev.map(e => e._id === emp._id ? e : e));
  };

  return (
    <div>
      <h3>Employees</h3>
      {source && <div className="mb-2"><strong>Data Source:</strong> {source}</div>} {/* <-- UI output */}
      <EmployeeForm 
        onSubmit={editId ? handleUpdate : handleCreate} 
        editing={!!editId} 
        initial={employees.find(e => e._id === editId)} 
      />
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && employees.length === 0 && <div>No employees yet</div>}
      <div className="list-group">
        {employees.map(emp => (
          <div key={emp._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div><strong>{emp.name}</strong> <small>({emp.department})</small></div>
              <div className="text-muted">{emp.email}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(emp)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(emp._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
