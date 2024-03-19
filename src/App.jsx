import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from '../components/Login';
import Signup from '../components/Signup';
import Task from '../components/Task';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/authContext';
import Profile from '../components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





function App() {

  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/task" element={<Task />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;
