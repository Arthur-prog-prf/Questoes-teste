import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import TodayDashboard from './pages/today-dashboard';
import StudyPlanner from './pages/study-planner';
import ExamSyllabusManager from './pages/exam-syllabus-manager';
import TaskManagementHub from './pages/task-management-hub';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<TodayDashboard />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/today-dashboard" element={<TodayDashboard />} />
        <Route path="/study-planner" element={<StudyPlanner />} />
        <Route path="/exam-syllabus-manager" element={<ExamSyllabusManager />} />
        <Route path="/task-management-hub" element={<TaskManagementHub />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;