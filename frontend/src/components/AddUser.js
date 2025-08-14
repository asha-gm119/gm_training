// src/components/AddUser.js
import React from "react";
import EmployeeList from "./EmployeeList";

export default function AddUser() {
  return (
    <div className="container mt-4">
      <h2>Add & Manage Employees</h2>
      <EmployeeList />
    </div>
  );
}
