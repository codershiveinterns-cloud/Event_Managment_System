import { Navigate, Outlet } from 'react-router-dom'
import { getAuthToken } from '../services/api.js'

export default function ProtectedRoute() {
  if (!getAuthToken()) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
