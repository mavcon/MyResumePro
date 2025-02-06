import React from "react";
import * as Sentry from "@sentry/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GetStarted from "./pages/GetStarted";
import ResumeUploadSignup from "./pages/signup/ResumeUploadSignup";
import ManualSignup from "./pages/signup/ManualSignup";
import LinkedInSignup from "./pages/signup/LinkedInSignup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Initialize Sentry only if DSN is provided
if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== 'your-actual-sentry-dsn') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0 },
};

const PageWrapper = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const MotionWrapper = ({ children }) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};

function App() {
  return (
    <MotionWrapper>
      <MotionConfig reducedMotion="user">
        <Router>
          <ErrorBoundary>
            <AuthProvider>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PageWrapper>
                          <Home />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/get-started"
                      element={
                        <PageWrapper>
                          <GetStarted />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/signup/resume-upload"
                      element={
                        <PageWrapper>
                          <ResumeUploadSignup />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/signup/manual"
                      element={
                        <PageWrapper>
                          <ManualSignup />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <PageWrapper>
                          <Login />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/signup/linkedin"
                      element={
                        <PageWrapper>
                          <LinkedInSignup />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <PageWrapper>
                            <Dashboard />
                          </PageWrapper>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <PageWrapper>
                          <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                            <p className="text-gray-600 mb-4">Page not found</p>
                            <button
                              onClick={() => window.history.back()}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                              Go Back
                            </button>
                          </div>
                        </PageWrapper>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </AuthProvider>
          </ErrorBoundary>
        </Router>
      </MotionConfig>
    </MotionWrapper>
  );
}

export default App;
