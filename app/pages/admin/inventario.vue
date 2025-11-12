<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-3xl font-bold text-purple-dark">Gestión de Inventario</h1>
        
        <div class="flex space-x-3 items-center">
             <NuxtLink 
                to="/admin/agregar-producto"
                class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md"
              >
                Añadir Nuevo Producto
            </NuxtLink>
        </div>
    </div>

    <div v-if="feedbackMessage" 
         :class="isError ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'"
         class="mb-6 p-4 rounded-lg border text-sm font-medium text-center">
        {{ feedbackMessage }}
    </div>

    <div v-if="pending" class="text-center py-10 text-gray-500">
        Cargando inventario...
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50">
        Error al cargar el inventario: {{ error.message }}
    </div>
    
    <div v-else>
        <h2 class="text-2xl font-bold text-purple-dark mb-4">
            <font-awesome-icon icon="fas fa-boxes" class="mr-2 text-purple-deep" />
            Lista Completa de Productos y Servicios
        </h2>

        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-purple-dark text-white">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/12">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-3/12">Producto</th>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Tipo</th>
                        <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-2/12">Proveedor</th>
                        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Stock</th>
                        <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider w-2/12">Precio Unitario</th>
                        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Estado</th>
                        <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/12">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    
                    <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-100 even:bg-purple-card transition duration-150">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">{{ producto.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class="text-sm font-semibold text-purple-dark">{{ producto.nombre }}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" 
                                  :class="{
                                    'bg-purple-100 text-purple-800': producto.tipo === 'Servicio',
                                    'bg-yellow-100 text-yellow-800': producto.tipo === 'Urna',
                                    'bg-blue-100 text-blue-800': producto.tipo === 'Accesorio',
                                    'bg-gray-100 text-gray-800': producto.tipo === 'Otro'
                                  }">
                                {{ producto.tipo }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {{ producto.proveedorNombre }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold" 
                            :class="producto.stock <= 10 ? 'text-red-600' : 'text-gray-700'">
                            {{ producto.tipo === 'Servicio' ? 'N/A' : producto.stock }}
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
                            
                            <button @click="deleteProduct(producto)" 
                                    class="text-red-600 hover:text-red-800 p-1 rounded-full transition duration-150 ml-2" 
                                    title="Eliminar Producto">
                                <font-awesome-icon icon="fas fa-trash-alt" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="!pending && productos && productos.length === 0" class="text-center py-10 text-gray-500">
                No se encontraron productos en el inventario.
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
// (MODIFICADO) Añadido faTrashAlt
import { faPencilAlt, faBoxes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; 

definePageMeta({
  middleware: 'auth'
});

library.add(faPencilAlt, faBoxes, faTrashAlt); // (MODIFICADO)
const router = useRouter();

// --- Tipado de Producto ---
interface Producto {
    id: number;
    nombre: string;
    proveedorNombre: string;
    stock: number;
    precio: number;
    disponible: boolean;
    tipo: string;
}

// --- Carga de Datos ---
const { 
  data: productos, 
  pending, 
  error, 
} = await useAsyncData<Producto[]>(
  'lista-inventario',
  () => $fetch('/api/admin/inventario'),
  {
    default: () => [] 
  }
);

// --- (NUEVO) Estados de Feedback ---
const isLoading = ref(false); // Para la acción de eliminar
const feedbackMessage = ref('');
const isError = ref(false);

// --- Lógica de UI ---
const editProduct = (producto: Producto) => {
    router.push(`/admin/editar-producto?id=${producto.id}`);
};

// --- (NUEVA) Lógica de Eliminación ---
const deleteProduct = async (producto: Producto) => {
  feedbackMessage.value = '';
  isError.value = false;

  // 1. Confirmar antes de borrar
  if (!confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}" (ID: ${producto.id})? Esta acción no se puede deshacer.`)) {
    return;
  }

  isLoading.value = true;
  
  try {
    // 2. Llama a la nueva API DELETE
    const response = await $fetch('/api/admin/eliminar-producto', {
      method: 'DELETE',
      body: { id: producto.id }
    });

    // 3. Éxito: Mostrar mensaje y actualizar UI
    isError.value = false;
    feedbackMessage.value = response.message;
    
    // 4. Actualiza la lista local para que el ítem desaparezca sin recargar
    if (productos.value) {
      productos.value = productos.value.filter(p => p.id !== producto.id);
    }

  } catch (err: any) {
    // 5. Error: Mostrar el mensaje de la API (ej: "No se puede borrar")
    isError.value = true;
    feedbackMessage.value = err.data?.statusMessage || 'Error al eliminar el producto.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* CLASES DE COLOR: Consistencia con la paleta Púrpura */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C2A72; } /* Corregido a un tono más oscuro */
.text-dark-primary-blue { color: #34495e; } /* Texto principal */

.bg-blue-100 { background-color: #e0f2fe; } 
.text-blue-800 { color: #1e40af; }

/* Fondo de fila alterna */
.even\:bg-purple-card:nth-child(even) {
     background-color: #fcfaff; 
}
.hover\:bg-gray-100:hover {
    background-color: #f3f4f6; 
}

/* Estilos específicos de tabla */
th {
    background-color: #4A235A;
}

/* Badges de TIPO */
.bg-purple-100 { background-color: #f3e5f5; }
.text-purple-800 { color: #6a1b9a; }
.bg-yellow-100 { background-color: #fffde7; }
.text-yellow-800 { color: #f57f17; }
.bg-gray-100 { background-color: #f3f4f6; }
.text-gray-800 { color: #1f2937; }

/* Clases de estado (Disponibilidad) */
.bg-green-100 { background-color: #d4edda; } 
.text-green-800 { color: #155724; } 
.bg-red-100 { background-color: #f8d7da; }
.text-red-800 { color: #721c24; }
.text-red-600 { color: #dc3545; }
.bg-red-50 { background-color: #fef2f2; }

/* (NUEVO) Color del botón de eliminar */
.text-red-600 { color: #dc3545; }
.hover\:text-red-800:hover { color: #a71d2a; }

/* (NUEVO) Colores de Feedback */
.border-green-300 { border-color: #c3e6cb; }
.border-red-300 { border-color: #f5c6cb; }
</style>