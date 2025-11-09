<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="max-w-2xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-purple-dark mb-3">Seguimiento de Servicio</h1>
        <p class="text-lg text-gray-600">Ingrese el código de 9 dígitos proporcionado para ver el estado de su servicio.</p>
      </div>

      <!-- Formulario de Búsqueda -->
      <form @submit.prevent="handleTracking" class="bg-white p-8 rounded-xl shadow-2xl border-b-8 border-purple-light flex flex-col sm:flex-row items-end gap-4">
        <div class="flex-grow w-full">
            <label for="trackingCode" class="block text-sm font-semibold text-dark-primary-blue mb-2">Código de Trazabilidad</label>
            <input 
              v-model="codigo" 
              type="text" 
              id="trackingCode"
              maxlength="9"
              placeholder="ABC-12345"
              @input="clearResult"
              class="w-full p-4 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep text-lg font-mono tracking-widest"
              required 
            />
        </div>
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full sm:w-auto px-6 py-4 bg-purple-deep text-white rounded-lg font-bold uppercase tracking-wider hover:bg-purple-light transition duration-150 shadow-md
                 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>

      <!-- Área de Resultados -->
      <div v-if="isLoading" class="text-center mt-8">
        <p class="text-lg text-purple-deep font-semibold">Buscando información...</p>
      </div>

      <!-- Mensaje de Error -->
      <div v-if="errorMessage" class="mt-8 p-4 rounded-lg text-center text-base bg-red-100 border border-red-400 text-red-700">
        {{ errorMessage }}
      </div>

      <!-- Resultados Encontrados -->
      <div v-if="resultado" class="mt-8 bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-green-500">
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-purple-dark">Servicio Encontrado</h2>
            <p class="text-base text-gray-600 mt-1">
              Servicio para <span class="font-bold">{{ resultado.mascota }}</span> registrado el {{ resultado.fecha }}.
            </p>
        </div>
        
        <div class="p-8 text-center">
          <p class="text-sm font-medium text-gray-500 uppercase">Estado Actual</p>
          <p class="text-4xl font-extrabold my-2" :class="getStatusClass(resultado.estado).text">
            {{ resultado.estado }}
          </p>
          <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="getStatusClass(resultado.estado).bg">
              Código: {{ resultado.codigo }}
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// No se necesita guardián, es una página pública
definePageMeta({
  title: 'Seguimiento de Servicio'
});

// --- Estado ---
const codigo = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// (NUEVO) Tipado para la respuesta de la API
interface TrackingResult {
  codigo: string;
  mascota: string;
  fecha: string;
  estado: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Cancelado';
}
const resultado = ref<TrackingResult | null>(null);

// --- Funciones ---

const clearResult = () => {
  resultado.value = null;
  errorMessage.value = '';
}

const handleTracking = async () => {
  if (!codigo.value) return;

  isLoading.value = true;
  clearResult();

  try {
    // 1. Llamar a la API (usamos $fetch porque es una acción, no una carga de página)
    const data = await $fetch<TrackingResult>('/api/tracking', {
      query: { codigo: codigo.value.toUpperCase() } // Enviar el código como query param
    });
    
    // 2. Éxito: Mostrar el resultado
    resultado.value = data;

  } catch (error: any) {
    // 3. Error: Mostrar el mensaje de la API (ej: "Código no encontrado")
    console.error('Error en el tracking:', error);
    errorMessage.value = error.data?.statusMessage || 'Error desconocido.';
  } finally {
    isLoading.value = false;
  }
};

// Lógica de UI (copiada de reservas.vue)
const getStatusClass = (status: TrackingResult['estado']) => {
    switch (status) {
        case 'Pendiente':
            return { bg: 'bg-yellow-100 text-yellow-800', text: 'text-yellow-600' };
        case 'En Proceso':
            return { bg: 'bg-purple-100 text-purple-deep', text: 'text-purple-deep' };
        case 'Finalizado':
            return { bg: 'bg-green-100 text-green-800', text: 'text-green-600' };
        case 'Cancelado':
            return { bg: 'bg-red-100 text-red-800', text: 'text-red-600' };
        default:
            return { bg: 'bg-gray-100 text-gray-800', text: 'text-gray-800' };
    }
};
</script>

<style scoped>
/* Estilos (Copiados de login.vue y reservas.vue) */
.text-purple-dark { color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.border-purple-deep { border-color: #5C2A72; } 
.focus\:border-purple-deep:focus { border-color: #5C2A72; }
.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }
.text-dark-primary-blue { color: #34495e; }
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
.bg-red-100 { background-color: #fef2f2; }
.border-red-400 { border-color: #fca5a5; }
.text-red-700 { color: #b91c1c; }
.text-red-600 { color: #dc3545; }
.border-green-500 { border-color: #22c55e; }
.text-green-600 { color: #16a34a; }
.bg-green-100 { background-color: #dcfce7; }
.text-green-800 { color: #15803d; }
.bg-yellow-100 { background-color: #fffbeb; }
.text-yellow-800 { color: #b45309; }
.text-yellow-600 { color: #d97706; }
.bg-purple-100 { background-color: #f3e5f5; }
</style>