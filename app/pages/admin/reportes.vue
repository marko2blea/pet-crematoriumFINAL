<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Reportes y Análisis</h1>
        
        <div class="flex space-x-3 items-center">
            <label for="statusFilter" class="text-sm font-medium text-purple-dark">Periodo:</label>
            <select v-model="dateRange" id="statusFilter" 
                    class="p-2 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-sm">
                <option value="mes">Último Mes</option>
                <option value="trimestre">Último Trimestre</option>
                <option value="anual">Último Año</option>
            </select>
            <button @click="generateReport" class="bg-purple-deep text-white p-2 rounded-lg hover:bg-purple-light transition duration-150 text-sm font-semibold">
                Generar
            </button>
        </div>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div class="bg-purple-card p-5 rounded-xl shadow-lg border-t-4 border-green-500">
            <p class="text-sm font-medium text-gray-500">Ingresos Totales ({{ dateRangeText }})</p>
            <p class="text-3xl font-extrabold text-green-600 mt-1">${{ kpis.totalRevenue.toLocaleString('es-CL') }}</p>
            <p class="text-xs text-gray-500">vs. Periodo anterior: +{{ kpis.revenueGrowth }}%</p>
        </div>

        <div class="bg-purple-card p-5 rounded-xl shadow-lg border-t-4 border-purple-deep">
            <p class="text-sm font-medium text-gray-500">Servicios Vendidos</p>
            <p class="text-3xl font-extrabold text-purple-deep mt-1">{{ kpis.servicesCount }}</p>
            <p class="text-xs text-gray-500">Total de órdenes completadas.</p>
        </div>
        
        <div class="bg-purple-card p-5 rounded-xl shadow-lg border-t-4 border-yellow-500">
            <p class="text-sm font-medium text-gray-500">Urnas Bajo Stock</p>
            <p class="text-3xl font-extrabold text-yellow-600 mt-1">{{ kpis.lowStockItems }}</p>
            <p class="text-xs text-gray-500">Requiere acción inmediata.</p>
        </div>

        <div class="bg-purple-card p-5 rounded-xl shadow-lg border-t-4 border-dark-primary-blue">
            <p class="text-sm font-medium text-gray-500">Ticket Promedio</p>
            <p class="text-3xl font-extrabold text-dark-primary-blue mt-1">${{ kpis.averageTicket.toLocaleString('es-CL') }}</p>
            <p class="text-xs text-gray-500">Gasto promedio por reserva.</p>
        </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h2 class="text-xl font-bold text-purple-dark mb-4 border-b pb-2">Tendencia de Ingresos vs. Metas</h2>
            
            <div class="h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 font-medium">
                [GRÁFICO DE BARRAS/LÍNEAS SIMULADO]
            </div>

            <p class="mt-4 text-sm text-gray-600">
                Tendencia actual: {{ reportData.trendStatus }}. El Servicio Premium sigue siendo la principal fuente de ingresos.
            </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h2 class="text-xl font-bold text-purple-dark mb-4 border-b pb-2">Servicios Más Populares</h2>

            <ul class="space-y-3">
                <li v-for="(service, index) in reportData.topServices" :key="index" class="flex justify-between items-center text-sm">
                    <p class="font-medium text-dark-primary-blue">{{ service.name }}</p>
                    <span class="font-bold text-purple-deep">{{ service.percentage }}%</span>
                </li>
            </ul>

            <div class="mt-6 border-t pt-4">
                 <h3 class="text-lg font-bold text-dark-primary-blue mb-2">Acción Rápida</h3>
                 <NuxtLink to="/admin/reportes/export" class="w-full bg-purple-deep text-white py-2 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md flex items-center justify-center">
                     <font-awesome-icon icon="fas fa-download" class="mr-2" /> Exportar Datos Completos
                 </NuxtLink>
            </div>
        </div>
    </section>

  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
});

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faBoxes, faDownload } from '@fortawesome/free-solid-svg-icons';

library.add(faFileAlt, faBoxes, faDownload);

const router = useRouter();

// Interfaz para tipado de KPIs 
interface KpiStats {
    totalRevenue: number;
    revenueGrowth: number;
    servicesCount: number;
    lowStockItems: number; // Nombre de propiedad CORRECTO
    averageTicket: number;
}

// Datos de Simulación para el Dashboard
const dateRange = ref('mes');
const lastUpdate = new Date().toLocaleTimeString();

const dateRangeText = computed(() => {
    switch(dateRange.value) {
        case 'trimestre': return 'Último Trimestre';
        case 'anual': return 'Último Año';
        default: return 'Último Mes';
    }
});

// Tipado explícito de ref para manejar la estructura KpiStats
const kpis = ref<KpiStats>({
    totalRevenue: 3250000,
    revenueGrowth: 18.5,
    servicesCount: 45,
    lowStockItems: 7, // Dato Inicializado
    averageTicket: 110000,
});

const reportData = ref({
    trendStatus: 'Crecimiento estable (promedio 15% mensual)',
    topServices: [
        { name: 'Servicio Premium', percentage: 45 },
        { name: 'Urna de Mármol', percentage: 25 },
        { name: 'Servicio Estándar', percentage: 15 },
        { name: 'Grabado Láser', percentage: 10 },
    ],
});

// --- FUNCIONES ---
const generateReport = () => {
    console.log(`Generando reporte para el periodo: ${dateRange.value}`);
    
    // Simulación de nuevos datos
    kpis.value.totalRevenue = Math.floor(Math.random() * 500000) + 3000000;
    
    // CORRECCIÓN DE TIPADO: Usamos parseFloat()
    kpis.value.revenueGrowth = parseFloat((Math.random() * 5 + 15).toFixed(1)); 
    
    kpis.value.servicesCount = Math.floor(Math.random() * 15) + 40;
    kpis.value.lowStockItems = Math.floor(Math.random() * 5) + 5; // Actualización
    kpis.value.averageTicket = Math.floor(Math.random() * 20000) + 100000;

    // router.push(`/admin/reportes?period=${dateRange.value}`);
};

// Se asegura que la función se ejecute al cargar si es necesario
onMounted(() => {
    // Si necesitas que cargue datos iniciales al arrancar
    // generateReport(); 
});
</script>


<style scoped>
/* CLASES DE COLOR: Consistencia con la paleta Púrpura */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }

/* Fondos Neutros y de Tarjeta */
.bg-white { background-color: #FFFFFF; }
.bg-purple-card { background-color: #F8F4FA; } /* Tinte púrpura sutil */

/* Texto principal del dashboard */
.text-dark-primary-blue { color: #34495e; } 
.border-dark-primary-blue { border-color: #34495e; }

/* Colores de Alerta (Mantenemos los tonos clásicos para claridad) */
.border-green-500 { border-color: #10B981; }
.text-green-600 { color: #059669; }
.border-yellow-500 { border-color: #F59E0B; }
.text-yellow-600 { color: #D97706; }
.border-red-500 { border-color: #EF4444; }
.text-red-600 { color: #DC2626; }
</style>