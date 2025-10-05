import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import TodayDashboard from './pages/today-dashboard';
import StudyPlanner from './pages/study-planner';
import ExamSyllabusManager from './pages/exam-syllabus-manager';
import TaskManagementHub from './pages/task-management-hub';

// --- Nossas Novas Importações ---
import Login from 'auth/Login';
import Register from 'auth/Register';
import ForgotPassword from 'auth/ForgotPassword'; // <-- Adicione esta importação
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from "./contexts/AuthContext";

// Este componente decide quais rotas mostrar
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      {/* Rotas Públicas */}
      <Route path="/login" element={user ? <Navigate to="/today-dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/today-dashboard" replace /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* <-- ADICIONE ESTA NOVA ROTA */}

      {/* Rota Principal */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <TodayDashboard />
          </ProtectedRoute>
        } 
      />

      {/* TODAS as outras páginas agora estão protegidas */}
      <Route 
        path="/analytics-dashboard" 
        element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/today-dashboard" 
        element={<ProtectedRoute><TodayDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/study-planner" 
        element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} 
      />
      <Route 
        path="/exam-syllabus-manager" 
        element={<ProtectedRoute><ExamSyllabusManager /></ProtectedRoute>} 
      />
      <Route 
        path="/task-management-hub" 
        element={<ProtectedRoute><TaskManagementHub /></ProtectedRoute>} 
      />
      
      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

// Este é o componente principal que o App.jsx vai usar
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <AppRoutes /> 
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;
