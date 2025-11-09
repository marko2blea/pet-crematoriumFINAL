import { ref, computed } from 'vue';
// (NUEVO) Importamos los tipos que ya definiste en app/types/index.ts
import type { Product, CartItem } from '~/types';

// Creamos el estado global 'cart'
const cart = ref<CartItem[]>([]);

export const useCart = () => {

  // Función para añadir un producto al carrito
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.id === product.id);

    if (existingItem) {
      // Si ya está, solo aumenta la cantidad
      existingItem.quantity += 1;
    } else {
      // Si es nuevo, lo añade con cantidad 1
      cart.value.push({ ...product, quantity: 1 });
    }
    
    // (Opcional) Guardar en sessionStorage para persistencia simple
    sessionStorage.setItem('cart', JSON.stringify(cart.value));
    
    alert(`'${product.nombre}' añadido al carrito!`);
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter(item => item.id !== productId);
    sessionStorage.setItem('cart', JSON.stringify(cart.value));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    cart.value = [];
    sessionStorage.setItem('cart', JSON.stringify(cart.value));
  };

  // (NUEVO) Cargar el carrito desde sessionStorage al iniciar
  const loadCart = () => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      cart.value = JSON.parse(savedCart);
    }
  };
  
  // (NUEVO) Un 'computed' para el total
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.precio * item.quantity), 0);
  });
  
  // (NUEVO) Un 'computed' para el conteo de items
  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });


  // Exponer el estado y las funciones
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    loadCart,
    cartTotal,
    cartCount
  };
};