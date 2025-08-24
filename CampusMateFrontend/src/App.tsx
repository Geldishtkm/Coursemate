import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Courses from '@/pages/Courses';
import Queries from '@/pages/Queries';
import Projects from '@/pages/Projects';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes - no navigation */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes - with navigation */}
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Courses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/queries" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Queries />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Projects />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin-only routes - with navigation */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Navigation />
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/queries" replace />} />
            <Route path="*" element={<Navigate to="/queries" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;