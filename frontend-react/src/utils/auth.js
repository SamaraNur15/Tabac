// src/utils/auth.js

/**
 * Gestión de tokens de autenticación
 */

const TOKEN_KEY = 'tabac_auth_token';
const USER_KEY = 'tabac_user_data';

export const authService = {
  /**
   * Guarda el token y datos del usuario en localStorage
   */
  setAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Obtiene el token de autenticación
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Obtiene los datos del usuario
   */
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obtiene el ID del usuario
   */
  getUserId() {
    const user = this.getUser();
    return user?.id || null;
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Cierra sesión eliminando token y datos
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Limpiar también el userId legacy si existe
    localStorage.removeItem('userId');
    // Disparar evento para actualizar UI
    window.dispatchEvent(new Event('userChanged'));
  },

  /**
   * Obtiene headers de autorización para requests
   */
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

/**
 * Interceptor para agregar token a todas las peticiones
 */
export const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...authService.getAuthHeaders(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Si el token expiró o es inválido, cerrar sesión
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/login';
  }

  return response;
};
