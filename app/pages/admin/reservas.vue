<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <!-- Encabezado -->
    <div class="flex flex-wrap justify-between items-center mb-8 border-b-2 border-gray-300 pb-3 gap-4">
        <h1 class="text-3xl font-bold text-purple-dark">Gestión de Reservas</h1>
        
        <!-- Filtros -->
        <div class="flex space-x-3 items-center">
            <label for="statusFilter" class="text-sm font-semibold text-dark-primary-blue">Filtrar por:</label>
            <select 
              v-model="filterStatus"
              id="statusFilter" 
              class="p-2 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
            >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
            </select>
        </div>
    </div>

    <!-- Contenedor de la Tabla -->
    <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <!-- Indicador de Carga -->
        <div v-if="pending" class="text-center py-10 text-gray-500">
            Cargando reservas...
        </div>

        <!-- Indicador de Error -->
        <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50">
            Error al cargar las reservas: {{ error.message }}
        </div>
        
        <!-- Tabla de Reservas -->
        <table v-else-if="reservations && reservations.length > 0" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-purple-dark text-white">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Mascota</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Servicio</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Cód. Trazabilidad</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Monto</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                
                <tr v-for="reserva in reservations" :key="reserva.id" class="hover:bg-purple-card transition duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">{{ reserva.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <p class="text-sm font-semibold text-purple-dark">{{ reserva.clientName }}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ reserva.petName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ reserva.serviceName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-deep">{{ reserva.trackingCode }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <!-- Lógica de Badges de Estado -->
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              :class="{
                                'bg-yellow-100 text-yellow-800': reserva.status === 'Pendiente',
                                'bg-blue-100 text-blue-800': reserva.status === 'En Proceso',
                                'bg-green-100 text-green-800': reserva.status === 'Finalizado',
                                'bg-red-100 text-red-800': reserva.status === 'Cancelado'
                              }">
                            {{ reserva.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-dark-primary-blue">
                        ${{ reserva.amount.toLocaleString('es-CL') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button @click="viewDetails(reserva.id)" class="text-purple-deep hover:text-purple-light p-1 rounded-full transition duration-150" title="Ver Detalles">
                            <font-awesome-icon icon="fas fa-eye" />
                        </button>
                        <button @click="editReserva(reserva.id)" class="text-purple-deep hover:text-purple-light p-1 rounded-full transition duration-150 ml-2" title="Editar Reserva">
                            <font-awesome-icon icon="fas fa-pencil-alt" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Mensaje si no hay resultados -->
        <div v-else class="text-center py-10 text-gray-500">
            No se encontraron reservas que coincidan con el filtro.
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons'; 

// 1. Proteger esta página
definePageMeta({
  middleware: 'auth',
  title: 'Gestión de Reservas'
});

library.add(faEye, faPencilAlt);
const router = useRouter();

// --- Carga de Datos y Filtros ---
const filterStatus = ref('Todos'); // Estado inicial del filtro

// Definimos el tipo de dato que esperamos de la API
interface Reserva {
    id: number;
    clientName: string;
    petName: string;
    petBreed: string;
    serviceName: string;
    trackingCode: string | null;
    status: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Cancelado';
    amount: number;
}

// 2. Llamada a la API (useAsyncData)
// (Usamos el truco de la variable para evitar el error de TypeScript)
const apiUrl = '/api/admin/reservas';
const { 
  data: reservations, 
  pending, 
  error,
  refresh // Función para recargar los datos
} = await useAsyncData<Reserva[]>(
  'lista-reservas',
  () => $fetch(apiUrl, { 
    params: { status: filterStatus.value } 
  }),
  {
    default: () => [], // Valor por defecto mientras carga
    watch: [filterStatus] // 3. Vuelve a llamar a la API automáticamente cuando 'filterStatus' cambia
  }
);

// --- Funciones de Acción ---
const viewDetails = (id: number) => {
    router.push(`/admin/detalle-reserva?id=${id}`);
};

const editReserva = (id: number) => {
    router.push(`/admin/editar-reserva?id=${id}`);
};
</script>

<style scoped>
/* Estilos Específicos */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-light { background-color: #6C3483; }
.text-dark-primary-blue { color: #34495e; }
.hover\:bg-purple-card:hover { background-color: #fcfaff; }
.focus\:border-purple-deep:focus { border-color: #5C2A72; }
.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }

/* Colores de Badges */
.bg-yellow-100 { background-color: #fff3cd; }
.text-yellow-800 { color: #856404; }
.bg-blue-100 { background-color: #d1ecf1; }
.text-blue-800 { color: #0c5460; }
.bg-green-100 { background-color: #d4edda; }
.text-green-800 { color: #155724; }
.bg-red-100 { background-color: #f8d7da; }
.text-red-800 { color: #721c24; }
</style>