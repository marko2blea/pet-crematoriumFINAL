<template>
    <div class="min-h-screen pt-14 bg-gray-50">
        
        <div class="container mx-auto px-4 py-8">
            
            <div class="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-deep">
                <h1 class="text-3xl font-bold text-dark-primary-blue">
                    <font-awesome-icon icon="fas fa-boxes" class="mr-3 text-purple-deep" /> Gestión de Inventario
                </h1>
                
                <button 
                    @click="redirigirANuevoItem"
                    class="bg-purple-deep text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-light transition duration-200 shadow-md flex items-center space-x-2"
                >
                    <font-awesome-icon icon="fas fa-plus" />
                    <span>Nuevo {{ activeTab === 'services' ? 'Servicio' : 'Producto' }}</span>
                </button>
            </div>

            <div class="mb-6 border-b border-gray-200">
                <nav class="flex space-x-4" aria-label="Tabs">
                    <button 
                        @click="activeTab = 'services'"
                        :class="[
                            activeTab === 'services' ? 'bg-purple-deep text-white shadow-md' : 'text-gray-600 hover:text-purple-dark hover:bg-gray-100',
                            'px-4 py-2 font-semibold text-lg rounded-t-lg transition-colors duration-150'
                        ]"
                    >
                        Servicios de Cremación
                    </button>
                    <button 
                        @click="activeTab = 'products'"
                        :class="[
                            activeTab === 'products' ? 'bg-purple-deep text-white shadow-md' : 'text-gray-600 hover:text-purple-dark hover:bg-gray-100',
                            'px-4 py-2 font-semibold text-lg rounded-t-lg transition-colors duration-150'
                        ]"
                    >
                        Urnas y Accesorios
                    </button>
                </nav>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
                <h2 class="text-xl font-semibold mb-6 border-b pb-2 text-dark-primary-blue">
                    Listado de {{ activeTab === 'services' ? 'Servicios' : 'Productos' }} ({{ itemsFiltrados.length }})
                </h2>

                <div class="mb-6 flex space-x-4">
                    <input 
                        type="text" 
                        v-model="busquedaTexto" 
                        placeholder="Buscar por nombre o ID..."
                        class="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150"
                    />
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-purple-card">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Nombre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Tipo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Precio (CLP)</th>
                                <th v-if="activeTab === 'products'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Stock</th>
                                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="item in itemsFiltrados" :key="item.id">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{{ item.nombre }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <span :class="{'bg-purple-deep/10 text-purple-deep': item.tipo.includes('Servicio'), 'bg-cyan-700/10 text-cyan-700': !item.tipo.includes('Servicio')}" 
                                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ item.tipo }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-primary-blue">
                                    ${{ item.precio.toLocaleString('es-CL') }}
                                </td>
                                <td v-if="activeTab === 'products'" class="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span :class="{'text-red-600': (item as Product).stock < 5, 'text-green-600': (item as Product).stock >= 5}" class="font-bold">
                                        {{ (item as Product).stock }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                                    <button @click="editarItem(item)" class="text-purple-deep hover:text-purple-light transition-colors duration-150 p-1 rounded-md">
                                        <font-awesome-icon icon="fas fa-edit" />
                                    </button>
                                    <button @click="eliminarItem(item)" class="text-red-600 hover:text-red-800 transition-colors duration-150 p-1 rounded-md">
                                        <font-awesome-icon icon="fas fa-trash" />
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="itemsFiltrados.length === 0">
                                <td :colspan="activeTab === 'products' ? 6 : 5" class="px-6 py-8 text-center text-gray-500">
                                    No se encontraron ítems en esta categoría que coincidan con la búsqueda.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'; 
import { useRouter } from 'vue-router'; // Importamos useRouter
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBoxes, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

library.add(faBoxes, faPlus, faEdit, faTrash); 

const router = useRouter(); // Inicializamos el router

// Definición de tipos para los ítems de inventario
interface Service {
    id: string;
    nombre: string;
    tipo: 'Servicio' | 'Servicio Extra';
    precio: number;
    descripcion: string;
}

interface Product {
    id: string;
    nombre: string;
    tipo: 'Urna' | 'Accesorio';
    precio: number;
    descripcion: string;
    stock: number; // Campo específico de productos/accesorios
}

// Para la lista general que mezcla tipos, usamos un tipo de unión
type InventarioItem = Service | Product;


// --- ESTADO DE LA VISTA ---
const activeTab = ref<'services' | 'products'>('services');
const busquedaTexto = ref('');

// --- DATOS SIMULADOS ---
const servicios: Ref<Service[]> = ref([
    { id: 'S003', nombre: 'Servicio Premium', tipo: 'Servicio', precio: 165000, descripcion: '...' }, 
    { id: 'S002', nombre: 'Servicio Estándar', tipo: 'Servicio', precio: 95000, descripcion: '...' },
    { id: 'S001', nombre: 'Servicio Económico', tipo: 'Servicio', precio: 40000, descripcion: '...' },
    { id: 'S004', nombre: 'Servicio de Recogida Express', tipo: 'Servicio Extra', precio: 30000, descripcion: '...' },
]);

const productos: Ref<Product[]> = ref([
    { id: 'U001', nombre: 'Urna de Mármol "Eternidad"', tipo: 'Urna', precio: 85000, descripcion: '...', stock: 12 },
    { id: 'U002', nombre: 'Urna de Madera "Paz"', tipo: 'Urna', precio: 50000, descripcion: '...', stock: 3 },
    { id: 'A001', nombre: 'Grabado Láser', tipo: 'Accesorio', precio: 15000, descripcion: '...', stock: 99 },
    { id: 'U003', nombre: 'Urna Metálica Clásica', tipo: 'Urna', precio: 45000, descripcion: '...', stock: 0 },
]);


// --- LÓGICA DE FILTRADO ---
const itemsActivos = computed<InventarioItem[]>(() => {
    // Usamos el operador de propagación para fusionar y tipar correctamente
    return activeTab.value === 'services' ? [...servicios.value] : [...productos.value];
});

const itemsFiltrados = computed<InventarioItem[]>(() => {
    const texto = busquedaTexto.value.toLowerCase();
    if (!texto) {
        return itemsActivos.value;
    }
    return itemsActivos.value.filter(item => 
        item.nombre.toLowerCase().includes(texto) ||
        item.id.toLowerCase().includes(texto)
    );
});


// --- LÓGICA DE ACCIONES (Redirección Actualizada) ---

// Función unificada para el botón "Nuevo..."
const redirigirANuevoItem = () => {
    const itemType = activeTab.value === 'services' ? 'servicio' : 'producto';
    router.push({ 
        path: '/admin/editar-producto', 
        query: { mode: 'create', type: itemType } 
    });
    console.log(`Redirigiendo a /admin/editar-producto?mode=create&type=${itemType}`);
};


const editarItem = (item: InventarioItem) => {
    const itemType = item.tipo.includes('Servicio') ? 'servicio' : 'producto';

    // Guardar el ID en la query para cargar el ítem en la vista de edición
    router.push({ 
        path: '/admin/editar-producto', 
        query: { mode: 'edit', id: item.id, type: itemType } 
    });
    console.log(`Redirigiendo a /admin/editar-producto?mode=edit&id=${item.id}&type=${itemType}`);
};

const eliminarItem = (item: InventarioItem) => {
    if (confirm(`¿Está seguro de eliminar el ítem "${item.nombre}" (${item.id})?`)) {
        console.log('Ítem eliminado (simulación):', item.nombre);
    }
};

definePageMeta({
    title: 'Gestión de Inventario'
});
</script>

<style scoped>
/* --------------------------------- */
/* PALETA DE COLORES (Extraídas de index.vue para consistencia) */
/* --------------------------------- */

.text-purple-dark {
    color: #4A235A; 
}
.bg-purple-light {
    background-color: #6C3483; 
}
.bg-purple-deep {
    background-color: #5C2A72; 
}
.text-purple-deep {
    color: #5C2A72; 
}
.border-purple-deep {
    border-color: #5C2A72; 
}
.bg-purple-card {
    background-color: #F8F4FA; 
}
.bg-cyan-700 { background-color: #17a2b8; }
.text-cyan-700 { color: #17a2b8; }
.bg-dark-primary-blue { background-color: #34495e; }
.text-dark-primary-blue { color: #34495e; }
.bg-white-subtle { background-color: #F8F4FA; }

/* Ajuste de color hover para el botón de acción principal */
.hover\:bg-purple-light:hover {
    background-color: #6C3483;
}
</style>