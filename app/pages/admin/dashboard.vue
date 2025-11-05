<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Dashboard de Administración</h1>
        <p class="text-sm text-gray-500">Última actualización: {{ lastUpdate }}</p>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-green-500">
            <p class="text-sm font-medium text-gray-500">Valor Neto (VAN)</p>
            <p class="text-3xl font-extrabold text-green-600 mt-1">$958.801 CLP</p>
            <p class="text-xs text-gray-500">Resultado de viabilidad.</p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-purple-deep">
            <p class="text-sm font-medium text-gray-500">Servicios en Proceso</p>
            <p class="text-3xl font-extrabold text-purple-dark mt-1">{{ stats.pendingServices }}</p>
            <p class="text-xs text-gray-500">Requieren gestión y trazabilidad.</p>
        </div>
        
        <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-yellow-500">
            <p class="text-sm font-medium text-gray-500">Pagos Pendientes</p>
            <p class="text-3xl font-extrabold text-yellow-600 mt-1">${{ stats.pendingPayments.toLocaleString('es-CL') }}</p>
            <p class="text-xs text-gray-500">Pendientes de confirmación.</p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-red-500">
            <p class="text-sm font-medium text-gray-500">Urnas Bajo Stock</p>
            <p class="text-3xl font-extrabold text-red-600 mt-1">{{ stats.lowStockItems }}</p>
            <p class="text-xs text-gray-500">Requiere acción inmediata.</p>
        </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h2 class="text-xl font-bold text-purple-dark mb-4 border-b pb-2">Reservas y Órdenes Recientes</h2>
            
            <ul class="space-y-3">
                <li v-for="order in recentOrders" :key="order.id" class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border-l-4" :class="order.status === 'Finalizado' ? 'border-green-500' : 'border-purple-light'">
                    <div class="text-sm">
                        <p class="font-semibold text-dark-primary-blue">{{ order.client }} - <span class="font-normal text-gray-600">{{ order.pet }}</span></p>
                        <p class="text-xs text-gray-500">{{ order.service }}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="order.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-dark'">
                        {{ order.status }}
                    </span>
                </li>
            </ul>
            
            <div class="mt-4 text-center">
                <NuxtLink to="/admin/reservas" class="text-sm font-semibold text-purple-dark hover:text-purple-light transition duration-150">
                    Ver todas las reservas →
                </NuxtLink>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h2 class="text-xl font-bold text-purple-dark mb-4 border-b pb-2">Acciones Rápidas</h2>

            <button class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md mb-3">
                <font-awesome-icon icon="fas fa-file-invoice-dollar" class="mr-2" /> Generar Reporte Básico
            </button>
            <NuxtLink to="/admin/inventario" class="w-full bg-gray-200 text-purple-dark py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-150 shadow-md flex items-center justify-center">
                 <font-awesome-icon icon="fas fa-boxes" class="mr-2" /> Gestionar Inventario
            </NuxtLink>

            <div class="mt-6 border-t pt-4">
                 <h3 class="text-lg font-bold text-purple-dark mb-2">Rentabilidad (TIR)</h3>
                 <div class="h-24 flex items-center justify-center bg-green-50 rounded-lg text-4xl font-extrabold text-green-600">
                     16%
                 </div>
                 <p class="text-xs text-gray-500 mt-2 text-center">Tasa Interna de Retorno (TIR).</p>
            </div>
        </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileInvoiceDollar, faBoxes } from '@fortawesome/free-solid-svg-icons';

library.add(faFileInvoiceDollar, faBoxes);

// Datos de Simulación para el Dashboard
const lastUpdate = new Date().toLocaleTimeString();

const stats = ref({
    pendingServices: 12,
    pendingPayments: 750000, // CLP
    lowStockItems: 3,
});

const recentOrders = ref([
    { id: 1, client: 'Familia Díaz', pet: 'Max (Labrador)', service: 'Premium', status: 'En Proceso' },
    { id: 2, client: 'Javier Soto', pet: 'Luna (Gata)', service: 'Estándar', status: 'Finalizado' },
    { id: 3, client: 'Ana P.', pet: 'Toby (Poodle)', service: 'Económico', status: 'Pendiente' },
]);

definePageMeta({
    title: 'Dashboard'
});
</script>

<style scoped>
/* CLASES DE COLOR DEL DASHBOARD */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }

.text-purple-deep { color: #5C2A72; }
.bg-purple-deep { background-color: #5C2A72; } 
.bg-purple-100 { background-color: #f3e5f5; } /* Fondo muy claro para etiquetas */

.text-dark-primary-blue { color: #34495e; } /* Título de tarjeta/texto principal */

/* Fondos Neutros */
.bg-white { background-color: #FFFFFF; }
</style>