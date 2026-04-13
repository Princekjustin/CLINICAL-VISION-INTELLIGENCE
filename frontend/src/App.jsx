import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./LandingPage";
import Login       from "./Login";
import Register    from "./Register";
import Dashboard   from "./Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = ()          => setUser(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/"          element={<LandingPage />} />

        {/* Auth routes */}
        <Route path="/login"     element={user ? <Navigate to="/dashboard" replace /> : <Login    onLogin={handleLogin} />} />
        <Route path="/register"  element={user ? <Navigate to="/dashboard" replace /> : <Register onRegister={handleLogin} />} />

        {/* Protected dashboard */}
        <Route path="/dashboard/*" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
