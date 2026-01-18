import { Route, Routes, useLocation, useNavigate } from "react-router";
import DashboardScreen from "./screens/DashboardScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { authService } from "./services/api/authService";
import Loading from "./components/ui/Loading";

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authorize = async () => {
      const result = await authService.refresh();

      if (result.status === "error") {
        navigate("/login");
      }
    };

    if (!isAuthenticated && location.pathname === "/") authorize();
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardScreen />
            ) : (
              <Loading title="Загрузка приложения..." />
            )
          }
        />

        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </>
  );
}
