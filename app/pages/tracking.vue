<template>
  <div class="pt-14 py-20 min-h-screen flex justify-center items-start">
    
    <div class="w-full max-w-lg bg-white-subtle p-8 rounded-xl shadow-2xl border border-purple-deep">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-purple-dark mb-2">
          Rastreo de Servicio
        </h1>
        <p class="text-gray-600">
          Ingrese el código único de trazabilidad de su mascota.
        </p>
      </div>

      <form @submit.prevent="handleTracking">
        
        <div class="mb-6 relative">
          <label for="trackingCode" class="block text-sm font-medium text-purple-dark mb-2">Código de Trazabilidad (9 caracteres)</label>
          <input 
            id="trackingCode" 
            v-model="trackingCode" 
            type="text" 
            required
            maxlength="9"
            placeholder="Ejemplo: TRC-94A-01"
            class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800 uppercase"
          />
          <font-awesome-icon icon="fas fa-search" class="absolute right-3 top-1/2 transform translate-y-1/2 text-gray-400" />
        </div>

        <button 
          type="submit" 
          :disabled="!trackingCode || isSearching"
          class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md disabled:opacity-50"
        >
          {{ isSearching ? 'Buscando...' : 'Buscar Estado' }}
        </button>

      </form>

      <div v-if="status" class="mt-8 p-6 rounded-xl border-t-4 border-purple-light bg-white">
          <p class="text-lg font-bold text-purple-dark mb-4">Detalles de Trazabilidad</p>
          
          <ol class="relative border-l-2 border-gray-200">                  
              <li v-for="(step, index) in status.history" :key="index" class="mb-6 ml-6">
                  <span class="absolute flex items-center justify-center w-4 h-4 bg-purple-deep rounded-full -left-2 ring-4 ring-white">
                    <font-awesome-icon v-if="index === 0" icon="fas fa-check" class="text-white text-xs" />
                  </span>
                  
                  <h3 class="flex items-center mb-1 text-md font-bold text-purple-dark">{{ step.title }}</h3>
                  <time class="block mb-2 text-sm font-normal leading-none text-gray-500">{{ step.time }}</time>
                  <p v-if="index === 0" class="text-sm text-gray-700 bg-purple-card p-3 rounded-lg border border-purple-light">
                      <span class="font-semibold">Estado Actual:</span> {{ status.current }}
                  </p>
              </li>       
          </ol>
          <p class="mt-6 text-xs text-gray-500 text-center">
             Código Verificado. Si tiene dudas sobre el estado, contáctenos.
          </p>
      </div>

      <div v-if="searchError" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
        {{ searchError }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch, faCheck, faPlus);

const trackingCode = ref('');
const status = ref<any>(null);
const isSearching = ref(false);
const searchError = ref('');

const handleTracking = () => {
  if (!trackingCode.value) return;

  isSearching.value = true;
  searchError.value = '';
  status.value = null;

  setTimeout(() => {
    isSearching.value = false;
    
    if (trackingCode.value === 'TRC-94A-01') {
      // Simulación de éxito
      status.value = {
        current: 'Urna Finalizada, Lista para Retiro',
        date: new Date().toLocaleString(),
        history: [
            { title: 'Servicio Finalizado / Urna Lista', time: '2025-11-03 16:00' },
            { title: 'Inicio de la Cremación', time: '2025-11-03 10:00' },
            { title: 'Mascota Recibida', time: '2025-11-02 18:00' },
            { title: 'Reserva Confirmada', time: '2025-11-02 10:00' },
        ]
      };
    } else {
      // Simulación de error
      searchError.value = 'Código de trazabilidad no encontrado. Verifique el código o contacte a soporte.';
    }
  }, 1500);
};

definePageMeta({
    title: 'Rastreo de Servicio'
});
</script>

<style scoped>
/* CLASES DE COLOR */
.text-purple-dark { color: #4A235A; } 
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.bg-purple-deep { background-color: #5C2A72; } 
.border-purple-deep { border-color: #5C2A72; }
.bg-purple-card { background-color: #F8F4FA; }
.ring-white { background-color: white; } /* Necesario para la línea de tiempo */

/* Fondo de tarjeta sutil */
.bg-white-subtle { background-color: #F8F4FA; } 

/* Estilos de foco del input */
.focus\:border-purple-deep:focus { border-color: #5C2A72; }
.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }
</style>