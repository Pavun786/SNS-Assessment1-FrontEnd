import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses, deleteExpense } from '../features/expence/expenceSlice';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ExpenseChart from './ExpenceChart';



function GetAllExpenses() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const status = useSelector((state) => state.expenses.status);
  const error = useSelector((state) => state.expenses.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteExpense(id));
  };



  return (
    <div>
      <Button variant="outlined" component={Link} to="/add-expence" style={{ margin: '20px' }}>
        Add New Expense
      </Button>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <>
          <ExpenseChart expenses={expenses} />
          <TableContainer component={Paper} style={{ overflowX: 'auto' }} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{expense.Amount}</TableCell>
                    <TableCell>{new Date(expense.Date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.Description}</TableCell>
                    <TableCell>{expense.Category?.CategoryName}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => navigate(`/edit-expence/${expense._id}`)}>
                        Edit
                      </Button>
                      <Button variant="outlined" onClick={() => handleDelete(expense._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default GetAllExpenses;
