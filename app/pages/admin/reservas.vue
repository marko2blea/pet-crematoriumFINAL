<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Gestión de Reservas</h1>
        
        <div class="flex space-x-3 items-center">
            <label for="statusFilter" class="text-sm font-medium text-purple-dark">Filtrar por Estado:</label>
            <!-- (ACTUALIZADO) Este select ahora controla la API -->
            <select v-model="filterStatus" id="statusFilter" 
                    class="p-2 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-sm">
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente (Pago/Confirmación)</option>
                <option value="En Proceso">En Proceso (Trazabilidad)</option>
                <option value="Finalizado">Finalizado (Entrega/Retiro)</option>
                <option value="Cancelado">Cancelado</option>
            </select>
        </div>
    </div>

    <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <!-- (NUEVO) Indicador de carga -->
        <div v-if="pending" class="text-center py-10 text-gray-500">
            Cargando reservas...
        </div>

        <!-- (NUEVO) Indicador de error -->
        <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50">
            Error al cargar las reservas: {{ error.message }}
        </div>
        
        <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-purple-dark text-white">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/12">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Cliente / Mascota</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Servicio / Urna</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Código Traz.</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Estado</th>
                    <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider w-2/12">Monto</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <!-- (ACTUALIZADO) El v-for ahora usa 'reservas' (los datos de la API) -->
                <tr v-for="reserva in reservas" :key="reserva.id" class="hover:bg-purple-card transition duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">{{ reserva.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <p class="text-sm font-semibold text-purple-dark">{{ reserva.clientName }}</p>
                        <!-- (ACTUALIZADO) Mostramos petName (la raza la omitimos por ahora) -->
                        <p class="text-xs text-gray-500">{{ reserva.petName }}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {{ reserva.serviceName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-mono" :class="reserva.status === 'Pendiente' ? 'text-gray-400' : 'text-purple-deep font-bold'">
                        {{ reserva.trackingCode || 'N/A' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(reserva.status)">
                            {{ reserva.status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-dark-primary-blue">
                        ${{ reserva.amount.toLocaleString('es-CL') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center space-x-2">
                        
                        <!-- (ACTUALIZADO) Botón Ver Detalles ahora envía el ID -->
                        <button @click="viewDetails(reserva)" 
                                class="text-purple-deep hover:text-purple-light p-1 rounded-full transition duration-150" 
                                title="Ver Detalles">
                            <font-awesome-icon icon="fas fa-file-alt" />
                        </button>

                        <button @click="editDetails(reserva)" 
                                class="text-purple-deep hover:text-purple-light p-1 rounded-full transition duration-150" 
                                title="Editar Reserva">
                            <font-awesome-icon icon="fas fa-pencil-alt" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- (ACTUALIZADO) Mensaje si no hay resultados -->
        <div v-if="!pending && reservas && reservas.length === 0" class="text-center py-10 text-gray-500">
            No se encontraron reservas con el estado seleccionado.
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'; 

// 1. Proteger esta página


library.add(faFileAlt, faPencilAlt);
const router = useRouter();

// --- (ACTUALIZADO) Carga de Datos ---

// 2. Estado del filtro (este 'ref' ahora controla la API)
const filterStatus = ref('Todos');

// 3. Objeto computado para los parámetros de la API
const queryParams = computed(() => ({
  status: filterStatus.value,
}));

// 4. Llamada a la API
const { 
  data: reservas, 
  pending, 
  error, 
  refresh 
} = await useAsyncData(
  'lista-reservas',
  () => $fetch('/api/admin/reservas', { 
    query: queryParams.value 
  }),
  {
    watch: [queryParams], // Vuelve a llamar a la API automáticamente cuando 'queryParams' cambia
    default: () => [] // Valor por defecto mientras carga
  }
);


// --- Lógica de UI ---

// Tipado para la data (coincide con el formato de la API)
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

const getStatusClass = (status: Reserva['status']) => {
    switch (status) {
        case 'Pendiente':
            return 'bg-yellow-100 text-yellow-800';
        case 'En Proceso':
            return 'bg-purple-100 text-purple-deep';
        case 'Finalizado':
            return 'bg-green-100 text-green-800';
        case 'Cancelado':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// --- (ACTUALIZADO) Funciones de Acción ---

const viewDetails = (reserva: Reserva) => {
    // (ACTUALIZADO) Navegamos a la página de detalle, pasando el ID como query param
    router.push(`/admin/detalle-reserva?id=${reserva.id}`);
};

const editDetails = (reserva: Reserva) => {
    // (Esta ya estaba correcta)
    router.push(`/admin/editar-reserva?id=${reserva.id}`);
};
</script>

<style scoped>
/* CLASES DE COLOR: Consistencia con la paleta Púrpura */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }
.bg-purple-100 { background-color: #f3e5f5; /* Tono muy claro para etiquetas */ }
.text-dark-primary-blue { color: #34495e; } /* Texto principal */

/* Estilos específicos de tabla */
th {
    /* Fondo del encabezado de tabla */
    background-color: #4A235A;
}
.bg-white {
    background-color: #FFFFFF;
}
.shadow-2xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.hover\:bg-purple-card:hover {
    background-color: #fcfaff; /* Tinte muy sutil al pasar el ratón */
}

/* Clases de estado (copiadas de detalle-reserva para consistencia) */
.bg-green-100 { background-color: #d4edda; } 
.text-green-800 { color: #155724; } 
.bg-yellow-100 { background-color: #fff3cd; } 
.text-yellow-800 { color: #856404; } 
.bg-red-100 { background-color: #f8d7da; }
.text-red-800 { color: #721c24; }
.bg-gray-100 { background-color: #f8f9fa; }
.text-gray-800 { color: #343a40; }
</style>