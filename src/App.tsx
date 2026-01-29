import { Route, Routes, useLocation, useNavigate } from "react-router";
import DashboardScreen from "./screens/DashboardScreen";
import SignInScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { authService } from "./api/services/authService";
import Loading from "./components/ui/Loading";

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authorize = async () => {
      const result = await authService.refresh();

      if (result.state === "error") {
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

        <Route path="/login" element={<SignInScreen />} />
        <Route path="/register" element={<SignUpScreen />} />
      </Routes>
    </>
  );
}
