<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-purple-dark mb-2">
        Carrito de Servicios y Productos
      </h1>
      <p class="text-gray-600">Revisa tu selección antes de finalizar la reserva.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        
        <div v-for="item in cartItems" :key="item.id" class="bg-white p-4 rounded-xl shadow-lg flex items-center border border-purple-card">
          
          <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mr-4">
            <img :src="item.imagenUrl || '/placeholder/producto.jpg'" :alt="item.nombre" class="w-full h-full object-cover">
          </div>

          <div class="flex-grow">
            <h3 class="text-lg font-bold text-purple-dark">{{ item.nombre }}</h3>
            <p class="text-sm text-gray-500">{{ item.tipo }} | Cantidad: {{ item.cantidad }}</p>
            <p class="text-md font-bold text-purple-deep mt-1">
              $ {{ (item.precio * item.cantidad).toLocaleString('es-CL') }} CLP
            </p>
          </div>
          
          <button @click="removeItem(item.id)" class="text-red-600 hover:text-red-800 transition duration-150 p-2 ml-4 rounded-full" title="Eliminar ítem">
            <font-awesome-icon icon="fas fa-trash" />
          </button>
        </div>

        <p v-if="cartItems.length === 0" class="text-center text-gray-500 bg-white-subtle p-5 rounded-lg shadow-md">
            Tu carrito está vacío.
        </p>

      </div>

      <div class="bg-white-subtle p-6 rounded-xl shadow-2xl sticky top-20 border border-purple-light">
        <h2 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2 border-purple-card">Resumen</h2>
        
        <div class="space-y-3 mb-6 text-gray-700">
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>$ {{ subtotal.toLocaleString('es-CL') }} CLP</span>
          </div>
          <div class="flex justify-between">
            <span>Costo de Recogida/Extras:</span>
            <span>$ {{ extraCost.toLocaleString('es-CL') }} CLP</span>
          </div>
          <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
            <span>TOTAL:</span>
            <span class="text-purple-deep">$ {{ total.toLocaleString('es-CL') }} CLP</span>
          </div>
        </div>

        <button 
          @click="proceedToCheckout" 
          :disabled="cartItems.length === 0"
          class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-purple-light transition duration-150 shadow-md disabled:opacity-50"
        >
          Finalizar Reserva y Pagar
        </button>
        
        <div class="mt-4 text-center">
            <h3 class="text-sm text-purple-dark font-semibold mb-2">Pago Seguro con:</h3>
            <div class="flex justify-center space-x-3 text-3xl text-gray-500">
                <font-awesome-icon icon="fab fa-cc-visa" title="Visa" />
                <font-awesome-icon icon="fab fa-cc-mastercard" title="Mastercard" />
                <font-awesome-icon icon="fas fa-credit-card" title="Transferencia" />
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';

library.add(faTrash, faCreditCard, faCcVisa, faCcMastercard);

const router = useRouter();

// --- SIMULACIÓN DE DATOS DEL CARRITO ---
interface CartItem {
    id: string;
    nombre: string;
    tipo: string;
    precio: number;
    cantidad: number;
    imagenUrl?: string;
}

const cartItems = ref<CartItem[]>([
    { id: 'S003', nombre: 'Servicio Premium', tipo: 'Servicio', precio: 165000, cantidad: 1, imagenUrl: '/servicios/premium.jpg' },
    { id: 'U001', nombre: 'Urna de Mármol', tipo: 'Urna', precio: 85000, cantidad: 1, imagenUrl: '/71zmEWBSB6L._AC_UF894,1000_QL80_.jpg' },
    { id: 'A001', nombre: 'Grabado Láser', tipo: 'Accesorio', precio: 15000, cantidad: 2, imagenUrl: '/accesorios/grabado_laser.jpg' },
]);

// --- LÓGICA COMPUTADA ---

const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
});

const extraCost = computed(() => {
    // Simulación de costo extra (recogida a domicilio, etc.)
    return 20000;
});

const total = computed(() => {
    return subtotal.value + extraCost.value;
});

// --- FUNCIONES ---

const removeItem = (id: string) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
};

const proceedToCheckout = () => {
    if (cartItems.value.length > 0) {
        console.log(`Procediendo al pago. Total: $${total.value.toLocaleString('es-CL')}`);
        // Aquí iría la redirección a la pasarela de pago o a la página de confirmación de reserva
        // router.push('/pago'); 
    }
};

definePageMeta({
    title: 'Carrito de Compras'
});
</script>

<style scoped>
/* CLASES DE COLOR (Para consistencia visual) */
.text-purple-dark { color: #4A235A; } 
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.hover\:bg-purple-light:hover { background-color: #6C3483; }

.bg-purple-deep { background-color: #5C2A72; }
.text-purple-deep { color: #5C2A72; }
.border-purple-deep { border-color: #5C2A72; }

/* FONDOS DE TARJETA */
.bg-white { background-color: #FFFFFF; }
.bg-white-subtle { background-color: #F8F4FA; } /* Fondo del resumen y tarjeta principal */
.bg-purple-card { background-color: #F8F4FA; } /* Usado para tarjetas sutiles */
.border-purple-card { border-color: #F8F4FA; }

.text-dark-primary-blue { color: #34495e; } /* Títulos de producto */

/* Para evitar que el carrito se mueva con el scroll, usa sticky top-20 */
.sticky {
  position: sticky;
}
</style>