import LoginUser from "../Pages/LoginPage/UserLoginPage"
import RegisterPage from "../Pages/RegisterPage/RegisterPage"
import FirstTimeLoginPage from "../Pages/FirstTimeLogin/FirstTimeLogin"
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword"


const LoginUserRoute = {
  path: "/login-user",
  element:  <LoginUser/>
}
const RegisterUserRoute = {
  path: "/register-user",
  element:  <RegisterPage/>
}
const FirstTimeLoginRoute = {
  path: "/first-time-login",
  element:  <FirstTimeLoginPage/>
}
const ForgotPasswordRoute = {
  path: "/forgot-password",
  element:  <ForgotPassword/>
}
export {LoginUserRoute, RegisterUserRoute,FirstTimeLoginRoute,ForgotPasswordRoute}
