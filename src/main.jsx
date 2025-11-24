import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ClientProvider } from "./context/ClientContext.jsx";
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading, authError } = useAuth();

  if (authLoading) return <div>Checking session...</div>;
  if (authError)
    return (
      <div className="auth-page">
        <div className="quote-card">
          <p>{authError}</p>
        </div>
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const Root = () => (
  <AuthProvider>
    <ClientProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </ClientProvider>
  </AuthProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
