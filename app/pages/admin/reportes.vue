<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Reportes</h1>
    </div>

    <div class="mb-6 p-4 bg-white rounded-lg shadow-md flex justify-center space-x-2">
        <span class="font-semibold text-gray-700 self-center mr-2">Filtrar por:</span>
        <button
          @click="period = 'month'"
          :class="period === 'month' ? 'bg-purple-deep text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          class="px-4 py-2 rounded-lg font-bold transition duration-150"
        >
          Mes Actual
        </button>
        <button
          @click="period = 'quarter'"
          :class="period === 'quarter' ? 'bg-purple-deep text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          class="px-4 py-2 rounded-lg font-bold transition duration-150"
        >
          Trimestre Actual
        </button>
        <button
          @click="period = 'year'"
          :class="period === 'year' ? 'bg-purple-deep text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          class="px-4 py-2 rounded-lg font-bold transition duration-150"
        >
          Año Actual
        </button>
    </div>

    <div class="bg-white rounded-xl shadow-2xl overflow-hidden mb-12">
        <div class="p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-purple-dark">
                <font-awesome-icon icon="fas fa-chart-line" class="mr-2 text-purple-deep" />
                Ingresos por Ventas
            </h2>
            <p class="text-gray-600">Mostrando datos para: <span class="font-semibold text-purple-deep">{{ periodTitle }}</span></p>
        </div>
        
        <div v-if="salesPending" class="text-center py-10 text-gray-500">
            Cargando gráfico de ventas...
        </div>
        <div v-else-if="salesError" class="text-center py-10 text-red-600 bg-red-50">
            Error al cargar el reporte de ventas: {{ salesError.message }}
        </div>
        <div v-else class="p-6">
            <div class="bg-purple-deep text-white p-6 rounded-lg shadow-xl mb-6 max-w-sm">
                <p class="text-sm uppercase tracking-wider text-purple-200">Total de Ingresos (Neto)</p>
                <p class="text-4xl font-extrabold">{{ (salesData?.total ?? 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) }}</p>
            </div>
            <div class="h-96">
                <VentasChart 
                  v-if="salesData && salesData.data.length > 0" 
                  :chartData="salesChartData" 
                />
                <p v-else class="text-center text-gray-500 pt-16">No hay datos de ventas para el período seleccionado.</p>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-purple-dark">
                    <font-awesome-icon icon="fas fa-box-open" class="mr-2 text-bd-gold-accent" />
                    Urnas Más Vendidas
                </h2>
            </div>
            <div v-if="urnasPending" class="text-center py-10 text-gray-500">
                Calculando reporte de urnas...
            </div>
            <div v-else-if="urnasError" class="text-center py-10 text-red-600 bg-red-50">
                Error al cargar el reporte de urnas: {{ urnasError.message }}
            </div>
            <div v-else>
                <table v-if="urnasData && urnasData.length > 0" class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold uppercase text-purple-dark tracking-wider w-8/12">Nombre</th>
                            <th class="px-6 py-3 text-center text-xs font-bold uppercase text-purple-dark tracking-wider w-4/12">Ventas</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="urna in urnasData" :key="urna.nombre" class="hover:bg-purple-card">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-dark-primary-blue">{{ urna.nombre }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{{ urna.ventas }}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="text-center text-gray-500 py-10">No se vendieron urnas en este período.</p>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-purple-dark">
                    <font-awesome-icon icon="fas fa-heart" class="mr-2 text-red-500" />
                    Servicios Más Vendidos
                </h2>
            </div>
            <div v-if="serviciosPending" class="text-center py-10 text-gray-500">
                Calculando reporte de servicios...
            </div>
            <div v-else-if="serviciosError" class="text-center py-10 text-red-600 bg-red-50">
                Error al cargar el reporte de servicios: {{ serviciosError.message }}
            </div>
            <div v-else>
                <table v-if="serviciosData && serviciosData.length > 0" class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold uppercase text-purple-dark tracking-wider w-8/12">Nombre</th>
                            <th class="px-6 py-3 text-center text-xs font-bold uppercase text-purple-dark tracking-wider w-4/12">Ventas</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="servicio in serviciosData" :key="servicio.nombre" class="hover:bg-purple-card">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-dark-primary-blue">{{ servicio.nombre }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{{ servicio.ventas }}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="text-center text-gray-500 py-10">No se vendieron servicios en este período.</p>
            </div>
        </div>

    </div> <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-purple-dark">
                <font-awesome-icon icon="fas fa-receipt" class="mr-2 text-gray-500" />
                Últimas Transacciones (Pagadas)
            </h2>
            <p class="text-gray-600">Mostrando datos para: <span class="font-semibold text-purple-deep">{{ periodTitle }}</span></p>
        </div>
        
        <div v-if="transaccionesPending" class="text-center py-10 text-gray-500">
            Cargando transacciones...
        </div>
        <div v-else-if="transaccionesError" class="text-center py-10 text-red-600 bg-red-50">
            Error al cargar las transacciones: {{ transaccionesError.message }}
        </div>
        <div v-else>
            <table v-if="transaccionesData && transaccionesData.length > 0" class="min-w-full divide-y divide-gray-200">
                <thead class="bg-purple-dark text-white">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID Pago</th>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Cliente</th>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Método</th>
                        <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Monto</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="tx in transaccionesData" :key="tx.id" class="hover:bg-purple-card transition duration-150">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">{{ tx.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ tx.fecha }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-dark">{{ tx.cliente }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ tx.metodo }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                            {{ tx.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else class="text-center text-gray-500 py-10">No se encontraron transacciones en el período seleccionado.</p>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ChartData } from 'chart.js';
import VentasChart from '../../../components/VentasChart.vue'; 
// (NUEVO) Importar iconos
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChartLine, faBoxOpen, faHeart, faReceipt } from '@fortawesome/free-solid-svg-icons';

library.add(faChartLine, faBoxOpen, faHeart, faReceipt);

definePageMeta({
  middleware: 'auth'
});

// --- Tipado de las APIs ---
interface SalesData {
  labels: string[];
  data: number[];
  total: number;
}
interface TopProduct {
  nombre: string;
  ventas: number;
}
interface Transaccion {
  id: number;
  fecha: string;
  cliente: string;
  monto: number;
  metodo: string;
}

// --- Estado Reactivo del Filtro ---
const period = ref<'month' | 'quarter' | 'year'>('month');

const periodTitle = computed(() => {
  if (period.value === 'year') return 'Este Año';
  if (period.value === 'quarter') return 'Este Trimestre';
  return 'Este Mes';
});

// --- Carga de Datos de Ventas (Gráfico) ---
const { 
  data: salesData, 
  pending: salesPending, 
  error: salesError 
} = await useAsyncData<SalesData>(
  'reporte-ventas',
  () => $fetch('/api/admin/reporte-ventas', { query: { period: period.value } }),
  { watch: [period] }
);

// --- Carga de Datos de Urnas (Tabla) ---
const { 
  data: urnasData, 
  pending: urnasPending, 
  error: urnasError 
} = await useAsyncData<TopProduct[]>(
  'reporte-urnas',
  () => $fetch('/api/admin/reporte-urnas', { query: { period: period.value } }),
  { watch: [period] }
);

// --- (NUEVO) Carga de Datos de Servicios (Tabla) ---
const { 
  data: serviciosData, 
  pending: serviciosPending, 
  error: serviciosError 
} = await useAsyncData<TopProduct[]>(
  'reporte-servicios',
  () => $fetch('/api/admin/reporte-servicios', { query: { period: period.value } }),
  { watch: [period] }
);

// --- (NUEVO) Carga de Datos de Transacciones (Tabla) ---
const { 
  data: transaccionesData, 
  pending: transaccionesPending, 
  error: transaccionesError 
} = await useAsyncData<Transaccion[]>(
  'reservas-recientes',
  () => $fetch('/api/admin/reservas-recientes', { query: { period: period.value } }),
  { watch: [period] }
);


// --- Formato de datos para el gráfico de ventas ---
const salesChartData = computed((): ChartData<'line'> => {
  const data = salesData.value;
  return {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Ingresos (CLP)',
        backgroundColor: '#6C3483', 
        borderColor: '#4A235A',     
        data: data?.data || [],
        fill: true,
        tension: 0.1,
      },
    ],
  };
});
</script>

<style scoped>
/* (Estilos sin cambios) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.text-purple-200 { color: #e9d5ff; }
.text-dark-primary-blue { color: #34495e; }
.bg-red-50 { background-color: #fef2f2; }
.hover\:bg-purple-card:hover {
    background-color: #fcfaff;
}
.text-bd-gold-accent { color: #FFD700; }
.text-red-500 { color: #EF4444; }
</style>