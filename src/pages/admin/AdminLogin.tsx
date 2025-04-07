
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../admin/Login';

const AdminLogin = () => {
  const navigate = useNavigate();

  // This is just a wrapper to maintain compatibility with the routing
  // The actual login functionality is in Login.tsx
  return <Login />;
};

export default AdminLogin;
