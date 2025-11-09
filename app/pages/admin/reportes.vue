<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Reporte de Ventas</h1>
        
        <div class="flex space-x-3 items-center">
             <button class="bg-green-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-700 transition duration-150 shadow-md">
                <font-awesome-icon icon="fas fa-file-excel" class="mr-2" />
                Exportar a Excel
            </button>
        </div>
    </div>

    <!-- (ACTUALIZADO) Tarjeta de Total de Ventas -->
    <div class="mb-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 max-w-sm">
        <p class="text-sm font-medium text-gray-500">Total Ventas (Finalizadas)</p>
        <div v-if="pending" class="h-10"></div>
        <div v-else-if="reporte" class="text-4xl font-extrabold text-green-700 mt-2">
            ${{ reporte.totalVentas.toLocaleString('es-CL') }}
        </div>
    </div>

    <!-- (NUEVO) Gráfico de Barras -->
    <div class="mb-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-deep">
        <h2 class="text-xl font-bold text-purple-dark mb-4">Ventas Mensuales ({{ new Date().getFullYear() }})</h2>
        <div v-if="pending" class="text-center py-10 text-gray-500">Cargando gráfico...</div>
        <div v-else-if="error" class="text-center py-10 text-red-600">Error al cargar el gráfico.</div>
        <!-- Contenedor del gráfico con altura fija -->
        <div v-else-if="chartData" style="height: 300px;">
            <Bar :data="chartData" :options="chartOptions" />
        </div>
    </div>


    <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <!-- (NUEVO) Indicador de carga -->
        <div v-if="pending" class="text-center py-10 text-gray-500">
            Generando reporte...
        </div>

        <!-- (NUEVO) Indicador de error -->
        <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50">
            Error al cargar el reporte: {{ error.message }}
        </div>
        
        <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-purple-dark text-white">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID Pago</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Servicio</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Método de Pago</th>
                    <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Monto</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                
                <!-- (ACTUALIZADO) El v-for ahora usa 'reporte.transacciones' -->
                <tr v-for="tx in reporte?.transacciones" :key="tx.id_pago" class="hover:bg-purple-card transition duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">#{{ tx.id_pago }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {{ tx.fecha }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <p class="text-sm font-semibold text-purple-dark">{{ tx.cliente }}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {{ tx.servicio }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ tx.metodo }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-dark-primary-blue">
                        ${{ tx.monto.toLocaleString('es-CL') }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- (ACTUALIZADO) Mensaje si no hay resultados -->
        <div v-if="!pending && reporte && reporte.transacciones.length === 0" class="text-center py-10 text-gray-500">
            No se encontraron transacciones finalizadas.
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'; 
// --- (NUEVO) Imports para Chart.js ---
import { Bar } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js';

// 1. Proteger esta página


library.add(faFileExcel);

// --- (NUEVO) Registrar Chart.js ---
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


// --- (ACTUALIZADO) Carga de Datos ---

// Tipado para la data (coincide con el formato de la API)
interface Transaccion {
    id_pago: number;
    fecha: string;
    cliente: string;
    servicio: string;
    metodo: string;
    monto: number;
}

// (ACTUALIZADO) La interfaz de Reporte ahora incluye 'chartData'
interface Reporte {
    transacciones: Transaccion[];
    totalVentas: number;
    chartData: number[]; // Array de 12 números
}

// 2. Llamada a la API de Reportes
const { 
  data: reporte, 
  pending, 
  error, 
} = await useAsyncData<Reporte>(
  'reporte-ventas',
  () => $fetch('/api/admin/reporte-ventas'),
  {
    default: () => ({
        transacciones: [],
        totalVentas: 0,
        chartData: new Array(12).fill(0) // Default para el gráfico
    }) // Valor por defecto mientras carga
  }
);


// --- (NUEVO) Lógica del Gráfico ---
const chartData = computed(() => ({
  labels: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  datasets: [
    {
      label: 'Ventas Mensuales',
      backgroundColor: '#6C3483', // Púrpura claro
      borderColor: '#4A235A',     // Púrpura oscuro
      borderWidth: 1,
      borderRadius: 4,
      data: reporte.value?.chartData || [], // Los datos de la API
    },
  ],
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, // Permite que el gráfico llene el 'div'
  plugins: {
    legend: {
      display: false, // Ocultar leyenda, es obvio
    },
    tooltip: {
      // Tooltips en CLP
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-CL', { 
              style: 'currency', 
              currency: 'CLP',
              maximumFractionDigits: 0 
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        // (CORREGIDO) Se eliminó el guion bajo '_' extra
        callback: (value: any) => new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(value),
      },
    },
  },
});

</script>

<style scoped>
/* CLASES DE COLOR: Consistencia con la paleta Púrpura */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; }
.border-purple-deep { border-color: #5C2A72; }
.text-dark-primary-blue { color: #34495e; } /* Texto principal */

/* Estilos específico de tabla */
th {
    background-color: #4A235A;
}
.hover\:bg-purple-card:hover {
    background-color: #fcfaff; /* Tinte muy sutil al pasar el ratón */
}

/* Colores de Reporte */
.bg-green-600 { background-color: #16a34a; }
.hover\:bg-green-700:hover { background-color: #15803d; }
.border-green-500 { border-color: #22c55e; }
.text-green-700 { color: #15803d; }
.bg-red-50 { background-color: #fef2f2; }
.text-red-600 { color: #dc2626; }
</style>