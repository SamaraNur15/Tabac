// src/comoponents/Admin/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../../utils/auth';

export default function ProtectedRoute({ children, requiredRole }) {
  const token = authService.getToken();
  const userData = authService.getUser() || {};
  
  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && !requiredRole.includes(userData.rol)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
