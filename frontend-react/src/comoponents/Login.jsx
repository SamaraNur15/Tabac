import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../utils/auth";
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json().catch(() => ({ message: 'Error en el servidor' }));

      if (!response.ok) {
        // Rate limiting (429)
        if (response.status === 429) {
          throw new Error(data.error || 'Has excedido el número de intentos. Espera 15 minutos e intenta nuevamente.');
        }
        
        // Mostrar errores de validación si existen
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(e => e.msg).join(', '));
        }
        throw new Error(data.message || data.error || 'Error en la autenticación');
      }

      // Debug: Ver qué recibimos del backend
      console.log('📥 Respuesta del login:', data);
      console.log('👤 Usuario:', data.user);
      console.log('🎭 Rol del usuario:', data.user?.rol);

      // Guardar token y datos del usuario
      authService.setAuth(data.token, data.user);

      // Verificar que se guardó correctamente
      console.log('💾 Usuario guardado:', authService.getUser());

      // Disparar evento para actualizar el header
      window.dispatchEvent(new Event('userChanged'));

      // Redirigir según el rol del usuario
      const userRole = data.user?.rol;
      console.log('🔀 Redirigiendo según rol:', userRole);
      
      if (userRole === 'admin' || userRole === 'cajero') {
        console.log('➡️ Redirigiendo a /admin');
        navigate("/admin");
      } else {
        console.log('➡️ Redirigiendo a /carta');
        navigate("/carta");
      }
    } catch (err) {
      setError(err.message || "Error en la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-wrapper">
        <h2>Iniciar Sesión</h2>
        <p className="login-subtitle">Acceso exclusivo para trabajadores</p>
        
        {error && <p className="login-error">{error}</p>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="email"
            name="email"
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange}
            required
          />
          
          <input 
            type="password"
            name="password"
            placeholder="Contraseña (mínimo 6 caracteres)" 
            value={formData.password} 
            onChange={handleChange}
            required
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
