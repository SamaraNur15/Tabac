// src/Hooks/useCart.js
import { useState, useCallback, useEffect } from 'react';

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar carrito del localStorage
  useEffect(() => {
    const cartData = localStorage.getItem('tabac_cart');
    if (cartData) {
      try {
        setItems(JSON.parse(cartData));
      } catch (e) {
        console.error('Error al cargar carrito:', e);
        setItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage siempre que cambie
  useEffect(() => {
    localStorage.setItem('tabac_cart', JSON.stringify(items));
  }, [items]);

  // Agregar item al carrito
  const agregarAlCarrito = useCallback((producto, cantidad = 1) => {
    setItems(prevItems => {
      const existente = prevItems.find(item => item._id === producto._id);
      
      if (existente) {
        // Si ya existe, aumentar cantidad
        return prevItems.map(item =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Agregar nuevo item
        return [...prevItems, { ...producto, cantidad }];
      }
    });
  }, []);

  // Eliminar item del carrito
  const eliminarDelCarrito = useCallback((productoId) => {
    setItems(prevItems => prevItems.filter(item => item._id !== productoId));
  }, []);

  // Actualizar cantidad de un item
  const actualizarCantidad = useCallback((productoId, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === productoId
            ? { ...item, cantidad }
            : item
        )
      );
    }
  }, [eliminarDelCarrito]);

  // Vaciar carrito
  const vaciarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  // Calcular total
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Cantidad total de items
  const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    items,
    loading,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    total,
    cantidadTotal,
  };
};
