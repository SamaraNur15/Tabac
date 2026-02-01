// src/Hooks/useOrden.js
import { useState, useCallback } from 'react';
import { authService, fetchWithAuth } from '../utils/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para obtener el userId
const getUID = () => {
  const userId = authService.getUserId();
  if (!userId) {
    console.warn('Usuario no autenticado');
    return null;
  }
  return userId;
};

export const useOrden = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crear una orden desde el carrito
  const crearOrden = useCallback(async (datosEntrega = {}, datosPago = {}) => {
    const uid = getUID();
    if (!uid) {
      throw new Error('Debes iniciar sesión para crear una orden');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/ordenes`, {
        method: 'POST',
        body: JSON.stringify({
          userId: uid,
          entrega: {
            modo: datosEntrega.modo || 'retiro',
            direccion: datosEntrega.direccion || null,
            notas: datosEntrega.notas || null
          },
          pago: {
            metodo: datosPago.metodo || 'efectivo'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      
      // Disparar evento para actualizar el contador del carrito
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return data;
    } catch (err) {
      console.error('Error al crear orden:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas las órdenes del usuario
  const obtenerOrdenes = useCallback(async () => {
    const uid = getUID();
    if (!uid) {
      throw new Error('Debes iniciar sesión');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/ordenes/user/${encodeURIComponent(uid)}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error al obtener órdenes:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una orden por número
  const obtenerOrdenPorNumero = useCallback(async (numero) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/ordenes/numero/${encodeURIComponent(numero)}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error al obtener orden:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    crearOrden,
    obtenerOrdenes,
    obtenerOrdenPorNumero,
    loading,
    error
  };
};
