<template>
  <div class="container mx-auto px-4 py-8 min-h-screen bg-gray-50 font-sans">
    
    <header class="flex justify-between items-center mb-8 pb-4 border-b border-indigo-300">
      <div class="flex items-center">
        <div class="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
             <i class="fas fa-microchip text-white text-xl"></i>
        </div>
        <h1 class="text-3xl font-light text-gray-800">
          Gestión Digital Crematorio <span class="text-indigo-600 font-semibold">S.A.</span>
        </h1>
      </div>
      <button @click="navigateTo('/admin/reservas')"
        class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition shadow-sm">
        <i class="fas fa-list-ul mr-2"></i> Volver al Listado
      </button>
    </header>

    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-5xl mx-auto">
      
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-indigo-600/50">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-search-plus text-indigo-600 mr-3"></i> Detalle de Reserva <span class="ml-2 text-indigo-700">#{{ reserva.codigo }}</span>
        </h2>
        <span :class="statusClass(reserva.estado)" class="px-4 py-1.5 text-sm font-bold uppercase rounded-full tracking-wider shadow-md">{{ reserva.estado }}</span>
      </div>

      <div class="mb-6 flex justify-end">
          <button @click="navigateTo(`/admin/reservas/editar/${reserva.codigo}`)"
            class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg">
            <i class="fas fa-edit mr-2"></i> Modificar Datos
          </button>
      </div>

      <div class="accordion-item" :class="{ 'active': activeSection === 'cliente' }">
        <div class="accordion-header" @click="toggleSection('cliente')">
          <h3 class="accordion-title">
            <i class="fas fa-user-circle mr-3 text-indigo-500"></i> 1. Datos de Contacto del Cliente
          </h3>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'cliente' }"></i>
        </div>
        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetalleCampo label="Nombre Completo" :value="reserva.cliente" />
            <DetalleCampo label="Teléfono" :value="reserva.telefono" />
            <DetalleCampo label="Correo Electrónico" :value="reserva.email" />
            <DetalleCampo label="Fecha de Registro" :value="reserva.fechaReserva" />
          </div>
        </div>
      </div>

      <div class="accordion-item mt-4" :class="{ 'active': activeSection === 'servicio' }">
        <div class="accordion-header" @click="toggleSection('servicio')">
          <h3 class="accordion-title">
            <i class="fas fa-paw mr-3 text-indigo-500"></i> 2. Detalles del Servicio y la Mascota
          </h3>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'servicio' }"></i>
        </div>
        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DetalleCampo label="Mascota" :value="reserva.mascota" />
            <DetalleCampo label="Raza" :value="reserva.raza" />
            <DetalleCampo label="Peso (Kg)" :value="`${reserva.peso} Kg`" />
            <DetalleCampo label="Fecha Agendada" :value="reserva.fecha" />
            <div class="col-span-full">
              <DetalleCampo label="Servicio Contratado" :value="reserva.servicio" />
            </div>
            <div class="col-span-full" v-if="reserva.personalizacion">
              <DetalleCampo label="Personalización Urna (RU07)" :value="reserva.personalizacion" class="text-sm italic" />
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item status-section mt-4" :class="{ 'active': activeSection === 'trazabilidad' }">
        <div class="accordion-header" @click="toggleSection('trazabilidad')">
          <h3 class="accordion-title">
            <i class="fas fa-code-branch mr-3 text-violet-600"></i> 3. Trazabilidad y Logística (RF01/RF02)
          </h3>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'trazabilidad' }"></i>
        </div>
        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetalleCampo label="Cód. Único de Trazabilidad" :value="reserva.codigo" class="font-mono text-indigo-700 font-bold" />
            <DetalleCampo label="Última Actualización (RF02)" :value="reserva.estado" class="font-bold text-violet-600" />
            <DetalleCampo label="Fecha de Retiro/Entrega (RF05)" :value="reserva.fechaRetiro || 'Aún no registrado'" />
            <div class="col-span-full">
              <DetalleCampo label="Ubicación de Cementerio/Parcela" :value="reserva.ubicacionCementerio || 'N/A'" />
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item payment-section mt-4" :class="{ 'active': activeSection === 'pagos' }">
        <div class="accordion-header" @click="toggleSection('pagos')">
          <h3 class="accordion-title">
            <i class="fas fa-dollar-sign mr-3 text-green-700"></i> 4. Información Financiera (RF11)
          </h3>
          <i class="fas fa-chevron-down transform transition-transform" :class="{ 'rotate-180': activeSection === 'pagos' }"></i>
        </div>
        <div class="accordion-content p-5">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DetalleCampo label="Monto Total" :value="`$${reserva.montoTotal.toLocaleString('es-CL')} CLP`" class="text-lg font-extrabold text-indigo-700" />
            <DetalleCampo label="Monto Abonado" :value="`$${reserva.montoAbonado.toLocaleString('es-CL')} CLP`" class="text-green-600 font-bold" />
            <DetalleCampo label="Saldo Pendiente" :value="`$${reserva.saldoPendiente.toLocaleString('es-CL')} CLP`" class="text-red-600 font-bold" />
            <DetalleCampo label="Método de Pago" :value="reserva.metodoPago" />
          </div>

          <div class="mt-8 pt-4 border-t border-gray-200">
            <h4 class="font-semibold text-gray-700 mb-3">Documentos y Notificaciones:</h4>
            <button class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition mr-3 shadow-md">
              <i class="fas fa-file-pdf mr-2"></i> Descargar Factura (RF08)
            </button>
          </div>
        </div>
      </div>
      
    </div>
    
    <DetalleCampo v-for="n in 1" :key="n" class="hidden" label="" value="" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, onMounted } from 'vue';
import { navigateTo } from '#app'; 

// --- 1. INTERFACE DE DATOS (MOCK) ---
interface Reserva {
  codigo: string;
  cliente: string;
  email: string;
  telefono: string;
  mascota: string;
  raza: string;
  peso: number;
  servicio: string;
  personalizacion: string; 
  estado: string;
  fecha: string; 
  fechaReserva: string;
  fechaRetiro: string | null; 
  ubicacionCementerio: string | null;
  montoTotal: number;
  montoAbonado: number;
  saldoPendiente: number;
  metodoPago: string;
}

// --- 2. ESTADO Y DATA MOCK (SIMULADA SIN DB) ---
const activeSection = ref('cliente'); 

const reserva = ref<Reserva>({
  codigo: '9CF8A2B6E1D7',
  cliente: 'Juan Pérez Rodríguez',
  email: 'juan.perez@email.com',
  telefono: '+56 9 1234 5678',
  mascota: 'Fido',
  raza: 'Poodle',
  peso: 12.5,
  servicio: 'Cremación Individual Premium (Incluye Urna Modelo B)',
  personalizacion: '"Fido, siempre en mi corazón"',
  estado: 'Urna Lista',
  fecha: '2025-11-10',
  fechaReserva: '2025-11-01',
  fechaRetiro: null, 
  ubicacionCementerio: 'N/A',
  montoTotal: 120000,
  montoAbonado: 90000,
  saldoPendiente: 30000,
  metodoPago: 'Webpay (Tarjeta de Crédito)',
});

// --- 3. LÓGICA DE UI Y AYUDA ---

const toggleSection = (section: string) => {
  activeSection.value = activeSection.value === section ? '' : section;
};

const statusClass = computed(() => (estado: string) => {
  if (estado === 'Urna Lista' || estado === 'Finalizada') {
    return 'bg-green-100 text-green-800';
  } else if (estado === 'En Proceso' || estado === 'Mascota Recibida') {
    return 'bg-yellow-100 text-yellow-800';
  }
  return 'bg-gray-200 text-gray-700';
});

// Componente auxiliar DetalleCampo simulado
const DetalleCampo = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    class: String
  },
  template: `
    <div class="detalle-campo-container">
        <label class="detalle-campo-label">{{ label }}</label>
        <p class="detalle-campo-value" :class="class">{{ value }}</p>
    </div>
  `,
});

onMounted(() => {
    // Simulación de carga de datos sin base de datos
    console.log(`Página de Detalle de Reserva lista. Usando diseño morado corporativo.`);
});


definePageMeta({
  middleware: 'auth'
});
</script>

<style scoped>
/* --- PALETA Y ESTILOS MORADOS (ÍNDIGO/VIOLET) --- */
.text-indigo-600 { color: #4F46E5; }
.bg-indigo-600 { background-color: #4F46E5; }
.hover\:bg-indigo-700:hover { background-color: #4338CA; }
.border-indigo-600\/50 { border-color: rgba(79, 70, 229, 0.5); }

.text-violet-600 { color: #7C3AED; }
.bg-violet-600 { background-color: #7C3AED; }
.hover\:bg-violet-700:hover { background-color: #6D28D9; }


/* --- ESTILOS DE ACORDEÓN --- */
.accordion-item {
    border: 1px solid #dcdbff; /* Borde más suave */
    border-radius: 0.5rem; 
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.accordion-header {
    padding: 1rem 1.5rem;
    background-color: #EEF2FF; /* Indigo-50 */
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease;
}

.accordion-header:hover {
    background-color: #E0E7FF; /* Indigo-100 */
}

.accordion-title {
    font-size: 1.125rem; 
    font-weight: 700; 
    color: #1F2937; /* Gray-800 */
    display: flex;
    align-items: center;
}

.accordion-item.active .accordion-header .fa-chevron-down {
    transform: rotate(180deg);
}

.accordion-content {
    display: none;
    border-top: 1px solid #E5E7EB;
}

.accordion-item.active .accordion-content {
    display: block;
}

/* --- CLASES DE DATOS --- */
.detalle-campo-container {
    padding: 0.75rem;
    background-color: #f9fafb; 
    border-radius: 0.375rem;
    border: 1px solid #E5E7EB;
}
.detalle-campo-label {
    display: block;
    font-size: 0.875rem; 
    font-weight: 500;
    color: #6B7280; 
    margin-bottom: 0.25rem;
}
.detalle-campo-value {
    font-weight: 600; 
    color: #1F2937; 
}


/* --- SECCIONES DE COLOR ESPECÍFICO --- */
.status-section .accordion-header {
    background-color: #FEF3C7; /* Yellow-100 */
}
.status-section .accordion-header .accordion-title {
    color: #B45309; /* Amber-700 */
}

.payment-section .accordion-header {
    background-color: #DCFCE7; /* Green-100 */
}
.payment-section .accordion-header .accordion-title {
    color: #16A34A; /* Green-600 */
}

/* Colores de Estado */
.bg-green-100 { background-color: #d4edda; } 
.text-green-800 { color: #155724; } 
.bg-yellow-100 { background-color: #fff3cd; } 
.text-yellow-800 { color: #856404; } 
.text-red-600 { color: #dc3545; }
.text-green-600 { color: #28a745; }
</style>