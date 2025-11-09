<template>
  <div class="container mx-auto px-4 py-8 min-h-screen bg-gray-50 font-sans">
    <h1 class="text-3xl font-bold mb-6 text-dark-primary-blue">
      <i class="fas fa-edit text-cyan-700 mr-2"></i> Editar Reserva: {{ reserva.codigo }}
    </h1>

    <form @submit.prevent="guardarCambios" class="bg-white p-6 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <p class="text-gray-600 mb-8 border-b pb-4">
        Utilice las secciones para gestionar y actualizar los detalles del servicio funerario.
      </p>

      <div class="accordion-item" :class="{ 'active': activeSection === 'detalles' }">
        <div class="accordion-header" @click="toggleSection('detalles')">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i class="fas fa-file-invoice mr-3"></i> 1. Datos Generales y Cliente
          </h2>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'detalles' }"></i>
        </div>

        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500">Cód. Trazabilidad:</label>
              <p class="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 font-mono">{{ reserva.codigo }}</p>
            </div>
            <div>
              <label for="cliente-nombre" class="block text-sm font-bold text-gray-700">Cliente</label>
              <input type="text" id="cliente-nombre" v-model="reserva.cliente"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition" />
            </div>
            <div>
              <label for="cliente-telefono" class="block text-sm font-bold text-gray-700">Teléfono</label>
              <input type="text" id="cliente-telefono" v-model="reserva.telefono"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition" />
            </div>
            <div>
              <label for="cliente-email" class="block text-sm font-bold text-gray-700">Email</label>
              <input type="email" id="cliente-email" v-model="reserva.email"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition" />
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item mt-4" :class="{ 'active': activeSection === 'servicio' }">
        <div class="accordion-header" @click="toggleSection('servicio')">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i class="fas fa-paw mr-3"></i> 2. Mascota, Peso y Servicio
          </h2>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'servicio' }"></i>
        </div>

        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="mascota-nombre" class="block text-sm font-bold text-gray-700">Nombre Mascota</label>
              <input type="text" id="mascota-nombre" v-model="reserva.mascota"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition" />
            </div>
            <div>
              <label for="mascota-peso" class="block text-sm font-bold text-gray-700">Peso (Kg)</label>
              <input type="number" step="0.01" id="mascota-peso" v-model="reserva.peso"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition" />
            </div>
            <div class="col-span-full">
              <label for="servicio-tipo" class="block text-sm font-bold text-gray-700">Servicio / Urna</label>
              <select id="servicio-tipo" v-model="reserva.servicio"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition">
                <option value="Cremación Individual Premium">Cremación Individual Premium</option>
                <option value="Cremación Individual Estándar">Cremación Individual Estándar</option>
                <option value="Cremación Comunitaria">Cremación Comunitaria</option>
                <option value="Urna Personalizada">Urna Personalizada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item status-section mt-4" :class="{ 'active': activeSection === 'trazabilidad' }">
        <div class="accordion-header" @click="toggleSection('trazabilidad')">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i class="fas fa-code-branch mr-3"></i> 3. Trazabilidad y Estado del Servicio
          </h2>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'trazabilidad' }"></i>
        </div>

        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="estado" class="block text-sm font-bold text-gray-700">Estado del Proceso</label>
              <select id="estado" v-model="reserva.estado"
                class="mt-1 block w-full p-3 border border-cyan-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition">
                <option value="Pendiente">1. Reserva Confirmada</option>
                <option value="Mascota Recibida">2. Mascota Recibida</option>
                <option value="En Proceso">3. Cremación en Proceso</option>
                <option value="Urna Lista">4. Urna/Restos Listos</option>
                <option value="Finalizada">5. Servicio Finalizado (Retiro/Entrega)</option>
              </select>
            </div>
            <div>
              <label for="fecha" class="block text-sm font-bold text-gray-700">Fecha Agendada / Recibida</label>
              <input type="date" id="fecha" v-model="reserva.fecha"
                class="mt-1 block w-full p-3 border border-cyan-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition">
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item payment-section mt-4" :class="{ 'active': activeSection === 'pagos' }">
        <div class="accordion-header" @click="toggleSection('pagos')">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            <i class="fas fa-dollar-sign mr-3"></i> 4. Gestión de Pagos
          </h2>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'pagos' }"></i>
        </div>

        <div class="accordion-content p-5">
          <div class="p-4 rounded-lg bg-yellow-50 border border-yellow-300 mb-6">
            <p class="font-semibold text-yellow-800">Estado Financiero:</p>
            <p class="text-sm text-yellow-700">Total: **$120.000 CLP** | Abonado: **$60.000 CLP** | **Saldo Pendiente: $60.000 CLP**</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="monto-abono" class="block text-sm font-bold text-gray-700">Registrar Nuevo Abono</label>
              <input type="number" id="monto-abono" placeholder="Monto en CLP"
                class="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 transition" />
            </div>
            <div>
              <label for="monto-abono" class="block text-sm font-bold text-white invisible">Acción</label>
              <button type="button" class="mt-1 w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
                <i class="fas fa-plus mr-2"></i> Registrar Pago
              </button>
            </div>
          </div>
          
          <div class="mt-8 pt-4 border-t border-gray-200">
             <button type="button" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mr-3">
                <i class="fas fa-receipt mr-2"></i> Generar Documento de Venta
             </button>
             <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <i class="fas fa-bell mr-2"></i> Enviar Recordatorio
             </button>
          </div>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t flex justify-end gap-3">
        <button type="button" @click="navigateTo('/admin/reservas')"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
          <i class="fas fa-times-circle mr-2"></i> Cancelar
        </button>
        <button type="submit"
          class="px-6 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition shadow-md">
          <i class="fas fa-save mr-2"></i> Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
});

import { ref } from 'vue';
import { navigateTo } from '#app'; 
import { onMounted } from 'vue'; // Importar onMounted para inicializar

interface Reserva {
  codigo: string;
  cliente: string;
  email: string; // Nuevo campo para edición
  telefono: string; // Nuevo campo para edición
  mascota: string;
  peso: number; // Nuevo campo para edición (RF14)
  servicio: string;
  estado: string;
  fecha: string;
}

// Estado para controlar qué sección del acordeón está abierta
const activeSection = ref('detalles'); // Inicia con la sección 'detalles' abierta

// Inicialización de la reserva con datos de ejemplo para edición
const reserva = ref<Reserva>({
  codigo: 'R-9CF8A2B6E1D7', // Cód. de trazabilidad (RF01)
  cliente: 'Juan Pérez', 
  email: 'juan.perez@email.com',
  telefono: '+56 9 1234 5678',
  mascota: 'Fido', 
  peso: 15.5, // Peso de la mascota (RF14)
  servicio: 'Cremación Individual Premium', 
  estado: 'Mascota Recibida', 
  fecha: '2025-11-06' // Usar fecha actual simulada
});

// Función para alternar la sección activa del acordeón
const toggleSection = (section: string) => {
  activeSection.value = activeSection.value === section ? '' : section;
};

const guardarCambios = () => {
  alert(`Simulando guardar cambios para la Reserva ${reserva.value.codigo}.`);
  // Lógica de PUT/PATCH API REST aquí
  navigateTo('/admin/reservas');
};


</script>

<style scoped>
/* Colores y fuentes del proyecto */
.text-dark-primary-blue { color: #34495e; } /* Azul oscuro profesional */
.text-cyan-700, .bg-cyan-700 { color: #17a2b8; background-color: #17a2b8; }
.border-cyan-700 { border-color: #17a2b8; }
.focus\:ring-cyan-700:focus { --tw-ring-color: #17a2b8; }

/* Estilos base para el acordeón (simulación Tailwind) */
.accordion-item {
    border: 1px solid #e5e7eb; /* gray-200 */
    border-radius: 0.5rem; /* rounded-lg */
    overflow: hidden;
}

.accordion-header {
    padding: 1rem 1.25rem;
    background-color: #f3f4f6; /* gray-100 */
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease;
}

.accordion-header:hover {
    background-color: #e5e7eb; /* gray-200 */
}

.accordion-header .fa-chevron-down {
    transition: transform 0.3s ease;
}

.accordion-item.active .accordion-header .fa-chevron-down {
    transform: rotate(180deg);
}

.accordion-content {
    display: none;
    border-top: 1px solid #e5e7eb;
}

.accordion-item.active .accordion-content {
    display: block;
}

/* Estilos para secciones con significado especial (como propusimos) */
.status-section .accordion-header {
    background-color: #fff3cd; /* yellow-100 */
    color: #856404; /* yellow-800 */
}
.status-section .accordion-header h2 {
    color: #856404;
}

.payment-section .accordion-header {
    background-color: #d4edda; /* green-100 */
    color: #155724; /* green-800 */
}
.payment-section .accordion-header h2 {
    color: #155724;
}
</style>