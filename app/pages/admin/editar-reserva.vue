<template>
  <div class="container mx-auto px-4 py-8 min-h-screen bg-gray-50 font-sans">
    <h1 class="text-3xl font-bold mb-6 text-dark-primary-blue">
      Gestión de Reserva
    </h1>

    <form @submit.prevent="guardarCambios" class="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
      
      <p class="text-gray-600 mb-6">
          Utilice este formulario editar una reserva.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="col-span-full border-b pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-700">Detalles de la Reserva </h2>
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-500">Cód. Reserva:</label>
          <p class="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium">
            {{ reserva.codigo }}
          </p>
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-500">Cliente:</label>
          <p class="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium">
            {{ reserva.cliente }}
          </p>
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-500">Mascota:</label>
          <p class="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium">
            {{ reserva.mascota }}
          </p>
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-500">Servicio / Urna:</label>
          <p class="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium">
            {{ reserva.servicio }}
          </p>
        </div>
      </div>
        
      <div class="border-b pt-4 pb-4 mb-4 mt-4">
          <h2 class="text-xl font-semibold text-gray-700">Editar</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label for="estado" class="block text-sm font-bold text-gray-700">Estado</label>
          <select id="estado" v-model="reserva.estado"
                  class="mt-1 block w-full p-3 border border-cyan-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700">
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>

        <div>
          <label for="fecha" class="block text-sm font-bold text-gray-700">Fecha de Servicio</label>
          <input type="date" id="fecha" v-model="reserva.fecha"
                 class="mt-1 block w-full p-3 border border-cyan-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700">
        </div>
      </div>

      <div class="mt-10 pt-6 border-t flex justify-end gap-3">
        <button type="button" @click="navigateTo('/admin/reservas')"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button type="submit" 
                class="px-6 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition">
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo } from '#app'; 

interface Reserva {
  codigo: string;
  cliente: string;
  mascota: string;
  servicio: string;
  estado: string;
  fecha: string;
}

// Inicialización de la reserva con valores estáticos de 'Creación'
const reserva = ref<Reserva>({
  codigo: 'R-NUEVA', 
  cliente: 'CLIENTE', 
  mascota: 'MASCOTA', 
  servicio: 'SERVICIO', 
  estado: 'Pendiente', 
  fecha: new Date().toISOString().substring(0, 10)
});

// En el modo simple, siempre es Creación (isEditing = false)
const isEditing = ref(false); 

const guardarCambios = () => {
  alert(`Simulando guardar nueva Reserva ${reserva.value.codigo}.`);
  navigateTo('/admin/reservas');
};


definePageMeta({
  title: 'Gestión de Reserva'
});
</script>

<style scoped>
.text-dark-primary-blue { color: #34495e; }
.text-cyan-700 { color: #17a2b8; }
.border-cyan-700 { border-color: #17a2b8; }
.focus\:ring-cyan-700:focus { --tw-ring-color: #17a2b8; }
</style>