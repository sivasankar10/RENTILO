import type { RouteObject } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'

export const authRoutes: RouteObject[] = [
  { index: true, element: <LoginPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
]
