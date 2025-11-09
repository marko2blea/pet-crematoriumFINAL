import { ref, computed, onMounted } from 'vue';
// (NUEVO) Asegúrate de que 'Product' y 'CartItem' estén en tus tipos
import type { Product, CartItem } from '~/types';

const CART_STORAGE_KEY = 'miApp_carrito';

// Estado reactivo para el carrito
const cart = ref<CartItem[]>([]);

/**
 * Carga el carrito desde sessionStorage al iniciar la app
 */
const loadCart = () => {
  if (process.client) { // Solo ejecutar en el navegador
    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      cart.value = JSON.parse(storedCart);
    }
  }
};

/**
 * Guarda el carrito en sessionStorage
 */
const saveCart = () => {
  if (process.client) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.value));
  }
};

export const useCart = () => {
  
  // Computadas para los totales
  const cartCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0));
  const cartTotal = computed(() => cart.value.reduce((total, item) => total + (item.precio * item.quantity), 0));

  /**
   * Añade un producto al carrito
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.value.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        tipo: product.tipo,
        quantity: quantity
      });
    }
    saveCart();
  };

  /**
   * Elimina un producto del carrito
   */
  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter(item => item.id !== productId);
    saveCart();
  };

  /**
   * Limpia el carrito (después del checkout)
   */
  const clearCart = () => {
    cart.value = [];
    saveCart();
  };

  return {
    cart,
    loadCart,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  };
};