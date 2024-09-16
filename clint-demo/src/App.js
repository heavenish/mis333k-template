import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ first_name: '', last_name: '', address: '', salary: '' });

  // Fetch Employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5000/employees')
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching employees:', error));
  };

  // Add New Employee
  const handleAdd = () => {
    setEditEmployee(null);  // Clear editEmployee to indicate "Add" mode
    setNewEmployee({ first_name: '', last_name: '', address: '', salary: '' });  // Clear form
    setOpenDialog(true);
  };

  // Edit Employee
  const handleEdit = (employee) => {
    setEditEmployee(employee);  // Set the employee to be edited
    setNewEmployee({ ...employee });  // Populate form with existing employee data
    setOpenDialog(true);
  };

  // Save Employee (for both Add and Edit)
  const handleSave = () => {
    if (editEmployee) {
      // Edit existing employee
      axios.put(`http://localhost:5000/employees/${editEmployee.id}`, newEmployee)
        .then(() => {
          fetchEmployees();
          setOpenDialog(false);
        })
        .catch((error) => console.error('Error updating employee:', error));
    } else {
      // Add new employee
      axios.post('http://localhost:5000/employees', newEmployee)
        .then(() => {
          fetchEmployees();
          setOpenDialog(false);
        })
        .catch((error) => console.error('Error adding employee:', error));
    }
  };

  // Delete Employee
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(() => {
        fetchEmployees();
      })
      .catch((error) => console.error('Error deleting employee:', error));
  };

  // Handle input changes in dialog form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>Employee Management</Typography>

      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
        Add Employee
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.first_name}</TableCell>
                <TableCell>{employee.last_name}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>${employee.salary}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(employee)}>Edit</Button>
                  <Button onClick={() => handleDelete(employee.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            value={newEmployee.first_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            value={newEmployee.last_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={newEmployee.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Salary"
            name="salary"
            value={newEmployee.salary}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
