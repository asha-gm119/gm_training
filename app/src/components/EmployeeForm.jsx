import React from 'react';

function EmployeeForm({ formData, onChange, onSubmit, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="border p-4 rounded bg-light shadow-sm">
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email:</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={onChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Department:</label>
        <input
          type="text"
          name="department"
          className="form-control"
          value={formData.department}
          onChange={onChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {isEditing ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  );
}

export default EmployeeForm;
