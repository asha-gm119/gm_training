import React, { useState, useEffect } from 'react';

export default function EmployeeForm({ onSubmit, editing, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [department, setDepartment] = useState(initial?.department || '');

  useEffect(() => {
    setName(initial?.name || '');
    setEmail(initial?.email || '');
    setDepartment(initial?.department || '');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, department });
    setName('');
    setEmail('');
    setDepartment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </div>
        <div className="col-md-1">
          <button className="btn btn-success w-100" type="submit">{editing ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </form>
  );
}
