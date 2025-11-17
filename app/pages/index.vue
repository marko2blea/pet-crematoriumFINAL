<template>
  <div> <section class="relative h-[60vh] md:h-[80vh] text-white flex items-center justify-center text-center shadow-lg" 
             style="background-image: url('/index.jpg'); background-size: cover; background-position: center; background-attachment: fixed;">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative z-10 p-4">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 animate-slide-in-top">
          APOYO EN LOS MOMENTOS MÁS DIFÍCILES
        </h1>
        <p class="text-lg md:text-2xl mb-8 animate-slide-in-bottom">
          ENTREGANDO UN SERVICIO PROFESIONAL, RESPETUOSO Y EMPÁTICO PARA QUIENES PIERDEN A UN SER QUERIDO.
        </p>
        <NuxtLink to="/#servicios" 
           class="bg-bd-gold-accent text-purple-dark font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-105 shadow-xl animate-fade-in">
          Conoce nuestros servicios
        </NuxtLink>
      </div>
    </section>

    <section id="servicios" class="container mx-auto px-4 py-20">
      
      <div v-if="pending" class="text-center text-gray-500 text-lg">
        <font-awesome-icon icon="fas fa-spinner" spin class="text-4xl" />
        <p class="mt-2">Cargando productos...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600 bg-red-50 p-4 rounded-lg">
        Error al cargar los productos: {{ error.message }}
      </div>
      
      <div v-else>
        <h2 class="text-4xl font-bold text-center text-purple-dark mb-12">Catálogo de Servicios</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          
          <div v-for="servicio in servicios" :key="servicio.id" 
            class="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col border-t-8 border-purple-dark">
            
            <NuxtLink :to="`/detalle-producto?id=${servicio.id}`" class="block flex flex-col flex-grow">
              <div class="h-56 w-full flex items-center justify-center bg-gray-100">
                <font-awesome-icon icon="fas fa-heart" class="text-6xl text-gray-300" />
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-purple-dark mb-2">{{ servicio.nombre }}</h3>
                <p class="text-2xl font-extrabold text-dark-primary-blue mb-4">
                  ${{ servicio.precio.toLocaleString('es-CL') }}
                </p>
                <span class="inline-block bg-purple-100 text-purple-deep text-sm font-semibold px-3 py-1 rounded-full mb-4 self-start">
                  {{ servicio.tipo }}
                </span>
              </div>
            </NuxtLink>
            <div class="p-5 pt-0 mt-auto">
              <button @click="addToCart(servicio, 1)" 
                      class="w-full text-center bg-bd-gold-accent text-purple-dark font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition duration-150 shadow-md">
                <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2"/>Añadir
              </button>
            </div>
          </div>
          </div>

        <h2 class="text-4xl font-bold text-center text-purple-dark mb-12">Catálogo de Urnas</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          <div v-for="urna in urnas" :key="urna.id" 
            class="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col border-t-8 border-purple-dark">
            
            <NuxtLink :to="`/detalle-producto?id=${urna.id}`" class="block flex flex-col flex-grow">
              <div class="h-56 w-full flex items-center justify-center bg-gray-100">
                <font-awesome-icon icon="fas fa-box-open" class="text-6xl text-gray-300" />
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-purple-dark mb-2">{{ urna.nombre }}</h3>
                <p class="text-2xl font-extrabold text-dark-primary-blue mb-4">
                  ${{ urna.precio.toLocaleString('es-CL') }}
                </p>
                <span class="inline-block bg-purple-100 text-purple-deep text-sm font-semibold px-3 py-1 rounded-full mb-4 self-start">
                  {{ urna.tipo }}
                </span>
              </div>
            </NuxtLink>
            <div class="p-5 pt-0 mt-auto">
              <button @click="addToCart(urna, 1)" 
                      class="w-full text-center bg-bd-gold-accent text-purple-dark font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition duration-150 shadow-md">
                <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2"/>Añadir
              </button>
            </div>
          </div>
          </div>
        </div>
    </section>

    <section class="bg-purple-dark text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-12">Lo que dicen nuestros clientes</h2>
        <div class="max-w-3xl mx-auto">
          <div class="bg-purple-deep p-8 rounded-xl shadow-lg">
            <font-awesome-icon icon="fas fa-quote-left" class="text-3xl text-bd-gold-accent mb-4" />
            <p class="text-xl italic mb-6">
              "En un momento tan difícil, el equipo de Crematorio San Antonio nos brindó un servicio lleno de empatía y profesionalismo. Estamos profundamente agradecidos por el respetuoso adiós que le dieron a nuestro querido Rocky."
            </p>
            <p class="font-bold text-lg">- Familia González</p>
          </div>
        </div>
      </div>
    </section>

  </div> </template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPaw, faHeart, faBoxOpen, faPuzzlePiece, faShoppingCart, 
  faQuoteLeft, faSpinner 
} from '@fortawesome/free-solid-svg-icons';

// Definir el tipo Product
type Product = {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
}

library.add(faPaw, faHeart, faBoxOpen, faPuzzlePiece, faShoppingCart, faQuoteLeft, faSpinner);

const { addToCart } = useCart();

// Cargar TODOS los productos desde la API
const { data: productos, pending, error } = await useAsyncData<Product[]>(
  'lista-productos', 
  () => $fetch('../api/productos'),
  {
    default: () => [] // Asegura que 'productos' nunca sea nulo
  }
);

// (MODIFICADO) Crear una lista computada solo para Servicios
const servicios = computed(() => {
  // El seed tiene 'Cremación Tradicional'
  return (productos.value || []).filter(p => p.tipo === 'Servicio');
});

// (MODIFICADO) Crear una lista computada solo para Urnas
const urnas = computed(() => {
  // El seed tiene 'Urna de Mármol Clásica'
  return (productos.value || []).filter(p => p.tipo === 'Urna');
});
</script>

<style scoped lang="postcss">
/* Estilos del diseño original */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; }
.text-purple-deep { color: #5C2A72; }
.bg-purple-deep { background-color: #5C2A72; }
.text-dark-primary-blue { color: #34495e; }
.text-bd-gold-accent { color: #FFD700; }
.bg-bd-gold-accent { background-color: #FFC107; }
.hover\:bg-yellow-400:hover { background-color: #ffd700; }
.bg-purple-100 { background-color: #f3e5f5; }

/* Efectos de animación que pediste */
.animate-slide-in-top {
  animation: slideInTop 1s ease-out forwards;
}
.animate-slide-in-bottom {
  animation: slideInBottom 1s ease-out forwards;
}
.animate-fade-in {
  animation: fadeIn 1.5s 0.5s ease-out forwards;
  opacity: 0;
}
@keyframes slideInTop {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes slideInBottom {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>