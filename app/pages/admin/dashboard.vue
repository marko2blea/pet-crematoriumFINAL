<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Dashboard de Administración</h1>
        <p class="text-sm text-gray-500">Última actualización: {{ lastUpdate }}</p>
    </div>

    <!-- Indicador de Carga General -->
    <div v-if="pendingStats || pendingOrders" class="text-center p-8 bg-white rounded-lg shadow-md">
      <p class="text-lg font-semibold text-purple-dark">Cargando datos del Dashboard...</p>
    </div>

    <!-- Indicador de Error -->
    <div v-else-if="statsError || ordersError" class="text-center p-8 bg-red-50 rounded-lg shadow-md border border-red-300">
      <p class="text-lg font-bold text-red-700">Error al cargar el Dashboard</p>
      <p class="text-gray-600 mt-2">{{ statsError?.statusMessage || ordersError?.statusMessage || 'No se pudieron cargar los datos.' }}</p>
    </div>

    <!-- Contenido principal, ahora usa v-else -->
    <div v-else>
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <!-- Tarjeta Estática (VAN) - Sin cambios -->
          <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-green-500">
              <p class="text-sm font-medium text-gray-500">Valor Neto (VAN)</p>
              <p class="text-3xl font-extrabold text-green-600 mt-1">$958.801 CLP</p>
              <p class="text-xs text-gray-500">Resultado de viabilidad.</p>
          </div>

          <!-- Tarjeta de Servicios en Proceso -->
          <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-purple-deep">
              <p class="text-sm font-medium text-gray-500">Servicios en Proceso</p>
              <p class="text-3xl font-extrabold text-purple-dark mt-1">{{ stats?.pendingServices || 0 }}</p>
              <p class="text-xs text-gray-500">Requieren gestión y trazabilidad.</p>
          </div>
          
          <!-- Tarjeta de Pagos Pendientes -->
          <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-yellow-500">
              <p class="text-sm font-medium text-gray-500">Pagos Pendientes</p>
              <p class="text-3xl font-extrabold text-yellow-600 mt-1">${{ (stats?.pendingPayments || 0).toLocaleString('es-CL') }}</p>
              <p class="text-xs text-gray-500">Pendientes de confirmación.</p>
          </div>

          <!-- Tarjeta de Stock Bajo -->
          <div class="bg-white p-5 rounded-xl shadow-xl border-t-4 border-red-500">
              <p class="text-sm font-medium text-gray-500">Urnas Bajo Stock</p>
              <p class="text-3xl font-extrabold text-red-600 mt-1">{{ stats?.lowStockItems || 0 }}</p>
              <p class="text-xs text-gray-500">Requiere acción inmediata.</p>
          </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
              <h2 class="text-xl font-bold text-purple-dark mb-4 border-b pb-2">Reservas y Órdenes Recientes</h2>
              
              <!-- Lista de Reservas Recientes -->
              <ul v-if="recentOrders && recentOrders.length > 0" class="space-y-3">
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
              
              <!-- Mensaje si no hay reservas -->
              <p v-else class="text-gray-500 text-center py-4">
                No se encontraron reservas recientes.
              </p>

              <div class="mt-4 text-center">
                  <NuxtLink to="/admin/reservas" class="text-sm font-semibold text-purple-dark hover:text-purple-light transition duration-150">
                      Ver todas las reservas →
                  </NuxtLink>
              </div>
          </div>

          <!-- Sección Estática (Acciones y TIR) - Sin cambios -->
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

  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
});

import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileInvoiceDollar, faBoxes } from '@fortawesome/free-solid-svg-icons';

// 1. Proteger esta página


library.add(faFileInvoiceDollar, faBoxes);

const lastUpdate = new Date().toLocaleTimeString();

// --- (CORREGIDO) Definir tipos explícitos ---
interface DashboardStats {
  pendingServices: number;
  pendingPayments: number;
  lowStockItems: number;
}

interface RecentOrder {
  id: number;
  client: string;
  pet: string;
  service: string;
  status: string;
}

// --- Carga de Datos de las APIs ---

// (CORRECCIÓN) Definir URLs como variables para EVITAR el error TS(2321)
// Al usar una variable, TypeScript no intenta "adivinar" el tipo de la API
// y se ve forzado a usar las interfaces que definimos arriba.
const statsUrl = '/api/admin/dashboard-stats';
const ordersUrl = '/api/admin/reservas-recientes';

// 2. Llamada a la API de Estadísticas (KPIs)
const { data: stats, pending: pendingStats, error: statsError } = await useAsyncData<DashboardStats>(
  'dashboard-stats',
  () => $fetch(statsUrl), // <-- Usar la variable
  { 
    default: () => ({
      pendingServices: 0,
      pendingPayments: 0,
      lowStockItems: 0
    }) 
  }
);

// 3. Llamada a la API de Reservas Recientes
const { data: recentOrders, pending: pendingOrders, error: ordersError } = await useAsyncData<RecentOrder[]>(
  'dashboard-recent-orders',
  () => $fetch(ordersUrl), // <-- Usar la variable
  { default: () => [] }
);

</script>

<style scoped>
/* CLASES DE COLOR DEL DASHBOARD */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }

.text-purple-deep { color: #5C2A72; }
.bg-purple-deep { background-color: #5C2A72; } 
.bg-purple-100 { background-color: #f3e5f5; /* Fondo muy claro para etiquetas */ }

.text-dark-primary-blue { color: #34495e; } /* Título de tarjeta/texto principal */

/* Fondos Neutros */
.bg-white { background-color: #FFFFFF; }

/* Colores de Alerta y Estado */
.border-green-500 { border-color: #10B981; }
.text-green-600 { color: #059669; }
.border-yellow-500 { border-color: #F59E0B; }
.text-yellow-600 { color: #D97706; }
.border-red-500 { border-color: #EF4444; }
.text-red-600 { color: #DC2626; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-red-50 { background-color: #fef2f2; }
.text-red-700 { color: #b91c1c; }
.bg-green-100 { background-color: #dcfce7; }
.text-green-700 { color: #15803d; }
.border-purple-light { border-color: #AB47BC; }
</style>