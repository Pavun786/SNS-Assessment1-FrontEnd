
import React from 'react';
import { Navigate } from 'react-router-dom';

 export function ProtectedRoute({children}) {

   const isAuth = localStorage.getItem("token")
    
  return (
    <>
     { isAuth ? children : <Navigate replace to ="/" />}
    </>
  )
}
