import LoginUser from "../Pages/LoginPage/UserLoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import FirstTimeLoginPage from "../Pages/FirstTimeLogin/FirstTimeLogin";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import LandingPage from "../Pages/LandingPage/LandingPage";

export const authRoutes = [
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login-user",
    element: <LoginUser />
  },
  {
    path: "/register-user",
    element: <RegisterPage />
  },
  {
    path: "/first-time-login/update-password",
    element: <FirstTimeLoginPage />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  }
];