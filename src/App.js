import './App.css';
import { Routes, Route, Link, Navigate, useParams, useNavigate } from "react-router-dom"
import { useState } from "react";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Login } from './Login';
import { Register } from './Register';
import { ProtectedRoute } from './ProtectedRoute';
import AddExpence from './Expence/CreateExpence';
import GetAllExpenses from './Expence/GetAllExpences';
import EditExpence from './Expence/EditExpence';



function App() {


  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const userName = localStorage.getItem("Name")

  const LoggingOut = () => {

    localStorage.clear()
    navigate("/")
  }

  return (

    <>
      <AppBar position="static">
        <Toolbar className='toolbar'>

          <h3>{userName}</h3>

          {
            token ? <Button onClick={() => LoggingOut()} color="inherit">
              Logout
            </Button> : "Login"
          }
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-expence" element={
          <ProtectedRoute>
          <AddExpence />
          </ProtectedRoute>
          } />
        <Route path='/getAll' element={
          <ProtectedRoute>
          <GetAllExpenses />
          </ProtectedRoute>
          } />
        <Route path='/edit-expence/:id' element={
          <ProtectedRoute>
          <EditExpence />
          </ProtectedRoute>
          } />
      </Routes>
    </>

  )
}

export default App;