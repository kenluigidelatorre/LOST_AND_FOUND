import { Navigate, Route, Routes } from "react-router-dom";

function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Lost and Found System</h1>
      <p>Frontend application is running.</p>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>404 - Page Not Found</h1>
      <a href="/">Go back home</a>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}