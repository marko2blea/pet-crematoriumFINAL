<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-purple-dark mb-3">Tu Carrito de Compras</h1>
        <p class="text-lg text-gray-600">Revisa los productos seleccionados antes de continuar.</p>
      </div>

      <!-- (NUEVO) Carrito Vacío -->
      <div v-if="!cart || cart.length === 0" 
           class="bg-white p-10 rounded-xl shadow-2xl border-t-8 border-purple-light text-center">
        <h2 class="text-2xl font-bold text-dark-primary-blue mb-4">Tu carrito está vacío</h2>
        <p class="text-gray-600 mb-6">Parece que aún no has añadido ningún servicio o producto.</p>
        <button @click="router.push('/')" 
                class="px-6 py-3 bg-purple-deep text-white rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md">
            Volver al Catálogo
        </button>
      </div>

      <!-- (NUEVO) Carrito Lleno -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna 1: Lista de Items -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-2xl border-t-8 border-purple-dark">
          <h2 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2">Productos en tu Pedido</h2>
          
          <ul class="space-y-4">
            <li v-for="item in cart" :key="item.id" 
                class="flex items-center space-x-4 p-4 border rounded-lg shadow-sm">
              
              <!-- Imagen Placeholder -->
              <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src="/logo2.png" alt="Logo" class="h-8 opacity-30"/>
              </div>
              
              <div class="flex-grow">
                <p class="font-semibold text-dark-primary-blue">{{ item.nombre }}</p>
                <p class="text-sm text-gray-500">
                  Cantidad: <span class="font-bold">{{ item.quantity }}</span> 
                  (Tipo: {{ item.tipo }})
                </p>
              </div>
              
              <div class="text-right">
                <p class="text-lg font-bold text-purple-deep">
                  ${{ (item.precio * item.quantity).toLocaleString('es-CL') }}
                </p>
                <button @click="removeFromCart(item.id)" 
                        class="text-xs text-red-600 hover:text-red-800 hover:underline transition">
                    Eliminar
                </button>
              </div>
            </li>
          </ul>

          <button @click="clearCart" 
                  class="text-sm text-gray-600 hover:text-red-600 transition duration-150 mt-4">
              <font-awesome-icon icon="fas fa-trash-alt" class="mr-1" />
              Vaciar Carrito
          </button>
        </div>

        <!-- Columna 2: Resumen del Pedido -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-bd-gold-accent sticky top-24">
            <h2 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2">Resumen</h2>
            
            <div class="space-y-3 text-lg">
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-semibold text-dark-primary-blue">${{ cartTotal.toLocaleString('es-CL') }}</span>
                </div>
                 <div class="flex justify-between">
                    <span class="text-gray-600">IVA (19%):</span>
                    <span class="font-semibold text-dark-primary-blue">${{ (cartTotal * 0.19).toLocaleString('es-CL') }}</span>
                </div>
                <hr class="border-gray-300">
                <div class="flex justify-between text-2xl font-bold text-purple-dark">
                    <span>Total:</span>
                    <span>${{ (cartTotal * 1.19).toLocaleString('es-CL') }}</span>
                </div>
            </div>

            <button @click="router.push('admin/reservas')" 
                    class="w-full mt-6 py-3 rounded-xl font-bold text-lg transition duration-300 shadow-lg 
                           bg-purple-deep text-white hover:bg-purple-light hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-deep/50">
                <font-awesome-icon icon="fas fa-arrow-right" class="mr-2" />
                Continuar Compra
            </button>
          </div>
        </div>
        
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashAlt, faArrowRight);

const router = useRouter();

// 1. Obtener todas las funciones y estados del composable
const { 
  cart, 
  removeFromCart, 
  clearCart, 
  loadCart, 
  cartTotal 
} = useCart();

// 2. Cargar el carrito desde sessionStorage
// Esto es crucial por si el usuario refresca la página
onMounted(() => {
  loadCart();
});

</script>

<style scoped>
/* Estilos (Copiados de detalle-producto.vue) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.border-purple-light { border-color: #6C3483; }
.bg-purple-deep { background-color: #5C2A72; } 
.text-purple-deep { color: #5C2A72; } 
.text-dark-primary-blue { color: #34495e; }
.text-bd-gold-accent { color: #FFD700; }
.border-bd-gold-accent { border-color: #FFD700; }
.focus\:ring-purple-deep\/50:focus { --tw-ring-color: rgba(92, 42, 114, 0.5); }
.text-red-600 { color: #dc3545; }
.hover\:text-red-800:hover { color: #a71d2a; }
</style>