<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <!-- (NUEVO) Estado de Carga -->
    <div v-if="pending" class="text-center p-10 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-dark-primary-blue">
        Cargando producto...
      </h1>
    </div>

    <!-- (NUEVO) Estado de Error -->
    <div v-else-if="error || !producto" class="text-center p-10 bg-red-50 rounded-xl shadow-lg border border-red-300">
      <h1 class="text-3xl font-bold text-red-700">Error al Cargar el Producto</h1>
      <p class="text-gray-600 mt-2">{{ error?.statusMessage || 'El producto no pudo ser encontrado.' }}</p>
      <button @click="router.push('/')"
        class="mt-6 px-5 py-2 bg-purple-dark text-white rounded-lg hover:bg-purple-deep transition shadow-lg">
        Volver al Catálogo
      </button>
    </div>

    <!-- (ACTUALIZADO) Contenido Principal -->
    <div v-else class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2">
        
        <!-- Columna de Imagen (Placeholder) -->
        <div class="bg-gray-200 flex items-center justify-center p-8 min-h-[300px]">
            <img src="/logo2.png" alt="Logo de producto" class="h-40 opacity-30"/>
        </div>

        <!-- Columna de Información -->
        <div class="p-8 flex flex-col">
          <span class="bg-purple-deep text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm mb-3 inline-block self-start">
              {{ producto.tipo }}
          </span>

          <h1 class="text-4xl font-extrabold text-purple-dark mb-4">
            {{ producto.nombre }}
          </h1>

          <div class="text-5xl font-extrabold text-bd-gold-accent mb-6">
              ${{ producto.precio.toLocaleString('es-CL') }}
          </div>
          
          <!-- Descripción Estática (como en index.vue) -->
          <h3 class="text-lg font-semibold text-dark-primary-blue mb-2">Este servicio incluye:</h3>
          <ul class="text-sm text-gray-700 space-y-2 mb-8 flex-grow">
              <li class="flex items-center"><font-awesome-icon icon="fas fa-check" class="text-green-500 mr-2" /> Certificado de Cremación</li>
              <li class="flex items-center"><font-awesome-icon icon="fas fa-check" class="text-green-500 mr-2" /> Urna (Modelo Básico)</li>
              <li class="flex items-center"><font-awesome-icon icon="fas fa-check" class="text-green-500 mr-2" /> Placa Recordatoria</li>
              <li class_s="flex items-center"><font-awesome-icon icon="fas fa-check" class="text-green-500 mr-2" /> Seguimiento del proceso</li>
          </ul>

          <!-- Botones de Acción -->
          <div class="space-y-3 mt-auto">
            <!-- (ACTUALIZADO) Botón "Añadir al Carrito" -->
            <button 
              @click="handleAddToCart"
              class="w-full py-3 rounded-xl font-bold text-lg transition duration-300 shadow-lg 
                     bg-purple-deep text-white hover:bg-purple-light hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-deep/50">
                <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2" />
                Añadir al Carrito
            </button>
            <button 
              @click="router.push('/carrito')"
              class="w-full py-3 rounded-xl font-bold text-lg transition duration-300 shadow-lg 
                     bg-bd-gold-accent text-purple-dark hover:bg-yellow-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-bd-gold-accent/50">
                <font-awesome-icon icon="fas fa-arrow-right" class="mr-2" />
                Ir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// (NUEVO) Importamos el tipo 'Product' que ya definimos
import type { Product } from '~/types';

library.add(faCheck, faShoppingCart, faArrowRight);

const route = useRoute();
const router = useRouter();
// (NUEVO) Obtenemos el carrito
const { addToCart } = useCart();

// --- (ACTUALIZADO) Carga de Datos ---
const productoId = computed(() => route.query.id as string);

const { 
  data: producto, 
  pending, 
  error 
} = await useAsyncData<Product>(
  'detalle-producto-publico',
  () => {
    if (!productoId.value) {
      throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' });
    }
    // 1. Llamar a la nueva API pública
    return $fetch('/api/producto', {
      query: { id: productoId.value }
    });
  },
  { watch: [productoId] }
);

// --- (NUEVO) Funciones de Acción ---
const handleAddToCart = () => {
  if (producto.value) {
    addToCart(producto.value);
    // (Opcional) Redirigir al carrito después de añadir
    // router.push('/carrito');
  }
};

</script>

<style scoped>
/* Estilos (Copiados de index.vue) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.bg-purple-deep { background-color: #5C2A72; } 
.text-purple-deep { color: #5C2A72; } 
.text-dark-primary-blue { color: #34495e; }
.text-bd-gold-accent { color: #FFD700; }
.bg-bd-gold-accent { background-color: #FFD700; }
.hover\:bg-yellow-500:hover { background-color: #ECC94B; }
.focus\:ring-purple-deep\/50:focus { --tw-ring-color: rgba(92, 42, 114, 0.5); }
.focus\:ring-bd-gold-accent\/50:focus { --tw-ring-color: rgba(255, 215, 0, 0.5); }

/* Errores */
.bg-red-50 { background-color: #fef2f2; }
.border-red-300 { border-color: #fca5a5; }
.text-red-700 { color: #b91c1c; }
.text-green-500 { color: #22c55e; }
</style>