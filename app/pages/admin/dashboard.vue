<template>
  <div class="pt-14 py-16 min-h-screen container mx-auto px-4 space-y-8">
    
    <div class="border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Dashboard</h1>
    </div>

    <div v-if="pendingStats" class="text-center p-10 bg-white rounded-xl shadow-lg">
        <p class="text-lg font-semibold text-gray-500">Cargando estadísticas...</p>
    </div>
    <div v-else-if="statsError" class="text-center p-10 bg-red-50 rounded-xl shadow-lg border border-red-300">
        <p class="text-lg font-semibold text-red-700">Error al cargar estadísticas: {{ statsError.message }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-purple-deep text-white p-6 rounded-xl shadow-2xl flex items-center space-x-4">
            <font-awesome-icon icon="fas fa-dollar-sign" class="text-4xl text-bd-gold-accent opacity-70" />
            <div>
                <p class="text-sm uppercase tracking-wider text-purple-200">Ingresos (Últ. 30 días)</p>
                <p class="text-3xl font-extrabold">{{ (stats.ingresosMes ?? 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-2xl flex items-center space-x-4">
            <font-awesome-icon icon="fas fa-clock" class="text-4xl text-yellow-500 opacity-70" />
            <div>
                <p class="text-sm uppercase tracking-wider text-gray-500">Reservas Pendientes</p>
                <p class="text-3xl font-extrabold text-purple-dark">{{ stats.reservasPendientes ?? 0 }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-2xl flex items-center space-x-4">
            <font-awesome-icon icon="fas fa-user-plus" class="text-4xl text-green-500 opacity-70" />
            <div>
                <p class="text-sm uppercase tracking-wider text-gray-500">Nuevos Clientes (Últ. 30 días)</p>
                <p class="text-3xl font-extrabold text-purple-dark">{{ stats.nuevosUsuariosMes ?? 0 }}</p>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-2xl">
            <h3 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2">
                <font-awesome-icon icon="fas fa-bell" class="mr-2 text-purple-deep" />
                Actividad Reciente (Pendientes de Pago)
            </h3>
            
            <div v-if="pendingActivity" class="text-center py-10 text-gray-500">
                Cargando actividad...
            </div>
            <div v-else-if="activityError" class="text-center py-10 text-red-600 bg-red-50">
                Error al cargar actividad: {{ activityError.message }}
            </div>
            <div v-else-if="!activityData || activityData.length === 0" class="text-center py-10 text-gray-500">
                <font-awesome-icon icon="fas fa-check-circle" class="text-4xl text-green-500 mb-3" />
                <p class="font-semibold">¡Todo al día!</p>
                <p>No hay reservas pendientes de pago.</p>
            </div>

            <div v-else class="space-y-4">
                <NuxtLink 
                  v-for="reserva in activityData" 
                  :key="reserva.id_reserva" 
                  :to="`/admin/editar-reserva?id=${reserva.id_reserva}`"
                  class="block p-4 rounded-lg hover:bg-purple-card transition duration-150 border-l-4 border-yellow-500 bg-white-subtle shadow-sm"
                >
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold text-purple-dark">{{ reserva.servicio }}</p>
                            <p class="text-sm text-gray-700">
                                Cliente: <span class="font-semibold">{{ reserva.cliente }}</span>
                            </p>
                        </div>
                        <div class="text-right flex-shrink-0 ml-4">
                            <p class="font-bold text-dark-primary-blue text-lg">{{ reserva.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) }}</p>
                            <p class="text-sm text-gray-500">{{ reserva.fecha }}</p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <div classs="space-y-6">
            <div class="bg-white p-6 rounded-xl shadow-2xl">
                <h3 class="text-2xl font-bold text-purple-dark mb-4">
                    <font-awesome-icon icon="fas fa-rocket" class="mr-2" />
                    Atajos Rápidos
                </h3>
                <div class="space-y-3">
                    <NuxtLink to="/admin/reservas" class="shortcut-link bg-purple-deep hover:bg-purple-light">
                        <font-awesome-icon icon="fas fa-book" class="mr-3" />
                        Gestionar Reservas
                    </NuxtLink>
                    <NuxtLink to="/admin/inventario" class="shortcut-link bg-purple-dark hover:bg-purple-light">
                        <font-awesome-icon icon="fas fa-boxes" class="mr-3" />
                        Gestionar Inventario
                    </NuxtLink>
                    <NuxtLink to="/admin/gestionar-usuario" class="shortcut-link bg-purple-dark hover:bg-purple-light">
                        <font-awesome-icon icon="fas fa-users" class="mr-3" />
                        Gestionar Usuarios
                    </NuxtLink>
                    <NuxtLink to="/admin/reportes" class="shortcut-link bg-bd-gold-accent text-purple-dark hover:bg-yellow-400">
                        <font-awesome-icon icon="fas fa-chart-line" class="mr-3" />
                        Ver Reportes
                    </NuxtLink>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// (NUEVO) Importar iconos para el dashboard
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faDollarSign, faClock, faUserPlus, faBell, faCheckCircle, 
    faRocket, faBook, faBoxes, faUsers, faChartLine
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faDollarSign, faClock, faUserPlus, faBell, faCheckCircle,
    faRocket, faBook, faBoxes, faUsers, faChartLine
);

// 1. Proteger esta página
definePageMeta({
  middleware: 'auth'
});

// --- Tipado de las APIs ---
interface DashboardStats {
    ingresosMes: number;
    reservasPendientes: number;
    nuevosUsuariosMes: number;
}
interface RecentActivity {
    id_reserva: number;
    cliente: string;
    servicio: string;
    monto: number;
    fecha: string;
}

// 2. Carga de datos de KPIs (Estadísticas)
const { 
  data: stats, 
  pending: pendingStats, 
  error: statsError 
} = await useAsyncData<DashboardStats>(
  'dashboard-stats',
  () => $fetch('/api/admin/dashboard-stats'), //
  {
    default: () => ({
      ingresosMes: 0,
      reservasPendientes: 0,
      nuevosUsuariosMes: 0
    })
  }
);

// 3. (NUEVO) Carga de datos de "Actividad Reciente"
const { 
  data: activityData, 
  pending: pendingActivity, 
  error: activityError 
} = await useAsyncData<RecentActivity[]>(
  'dashboard-activity',
  () => $fetch('/api/admin/dashboard-activity'), // La nueva API que creamos
  {
    default: () => []
  }
);
</script>

<style scoped lang="postcss">
/* (NUEVO) Estilo reutilizable para los botones de atajo */
.shortcut-link {
    @apply block w-full text-left text-white py-3 px-4 rounded-lg font-bold transition duration-150 shadow-md;
}

/* (Estilos de la paleta de colores) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C27A0; } /* Un poco más brillante para links */
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }
.text-bd-gold-accent { color: #FFD700; }
.bg-bd-gold-accent { background-color: #FFC107; }
.hover\:bg-yellow-400:hover { background-color: #FFD700; }
.bg-red-50 { background-color: #fef2f2; }
.text-red-700 { color: #b91c1c; }
.border-red-300 { border-color: #fca5a5; }
.text-gray-500 { color: #6b7280; }
.text-gray-700 { color: #374151; }
.text-dark-primary-blue { color: #34495e; }
.text-green-500 { color: #22c55e; }
.text-yellow-500 { color: #f59e0b; }
.bg-purple-card { background-color: #fcfaff; }
.bg-white-subtle { background-color: #F8F4FA; }
.border-yellow-500 { border-color: #f59e0b; }
</style>