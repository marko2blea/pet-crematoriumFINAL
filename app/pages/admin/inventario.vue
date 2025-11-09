<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Gestión de Inventario (Urnas y Productos)</h1>
        
        <div class="flex space-x-3 items-center">
             <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md">
                Añadir Nuevo Producto
            </button>
        </div>
    </div>

    <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <!-- (NUEVO) Indicador de carga -->
        <div v-if="pending" class="text-center py-10 text-gray-500">
            Cargando inventario...
        </div>

        <!-- (NUEVO) Indicador de error -->
        <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50">
            Error al cargar el inventario: {{ error.message }}
        </div>
        
        <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-purple-dark text-white">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/12">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-3/12">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Proveedor</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Stock</th>
                    <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider w-2/12">Precio Unitario</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Estado</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                
                <!-- (ACTUALIZADO) El v-for ahora usa 'productos' (los datos de la API) -->
                <tr v-for="producto in productos" :key="producto.id" class="hover:bg-purple-card transition duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">{{ producto.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <p class="text-sm font-semibold text-purple-dark">{{ producto.nombre }}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {{ producto.proveedorNombre }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold" 
                        :class="producto.stock <= 10 ? 'text-red-600' : 'text-gray-700'">
                        {{ producto.stock }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-dark-primary-blue">
                        ${{ producto.precio.toLocaleString('es-CL') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                              :class="producto.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ producto.disponible ? 'Disponible' : 'Agotado' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        
                        <button @click="editProduct(producto)" 
                                class="text-purple-deep hover:text-purple-light p-1 rounded-full transition duration-150" 
                                title="Editar Producto">
                            <font-awesome-icon icon="fas fa-pencil-alt" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- (ACTUALIZADO) Mensaje si no hay resultados -->
        <div v-if="!pending && productos && productos.length === 0" class="text-center py-10 text-gray-500">
            No se encontraron productos en el inventario.
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'; 

// 1. Proteger esta página
definePageMeta({
  middleware: 'auth'
});

library.add(faPencilAlt);
const router = useRouter();

// --- (ACTUALIZADO) Carga de Datos ---

// Tipado para la data (coincide con el formato de la API)
interface Producto {
    id: number;
    nombre: string;
    proveedorNombre: string;
    stock: number;
    precio: number;
    disponible: boolean;
}

// 2. Llamada a la API
const { 
  data: productos, 
  pending, 
  error, 
} = await useAsyncData<Producto[]>(
  'lista-inventario',
  () => $fetch('/api/admin/inventario'),
  {
    default: () => [] // Valor por defecto mientras carga
  }
);


// --- Lógica de UI ---

const editProduct = (producto: Producto) => {
    // Te llevará a la página de editar producto (que conectaremos después)
    router.push(`/admin/editar-producto?id=${producto.id}`);
};
</script>

<style scoped>
/* CLASES DE COLOR: Consistencia con la paleta Púrpura */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }
.text-dark-primary-blue { color: #34495e; } /* Texto principal */

/* Estilos específicos de tabla */
th {
    background-color: #4A235A;
}
.hover\:bg-purple-card:hover {
    background-color: #fcfaff; /* Tinte muy sutil al pasar el ratón */
}

/* Clases de estado (copiadas de reservas.vue) */
.bg-green-100 { background-color: #d4edda; } 
.text-green-800 { color: #155724; } 
.bg-red-100 { background-color: #f8d7da; }
.text-red-800 { color: #721c24; }
.text-red-600 { color: #dc3545; }
</style>