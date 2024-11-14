import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import CarForm from './pages/CarForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><CarList /></PrivateRoute>} />
            <Route path="/cars/new" element={<PrivateRoute><CarForm /></PrivateRoute>} />
            <Route path="/cars/:id" element={<PrivateRoute><CarDetail /></PrivateRoute>} />
            <Route path="/cars/:id/edit" element={<PrivateRoute><CarForm /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;