<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">

    <!-- (NUEVO) Estado de Carga -->
    <div v-if="pending" class="text-center p-10 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-dark-primary-blue">
        Cargando datos del producto...
      </h1>
      <p class="text-gray-500 mt-2">Por favor, espere un momento.</p>
    </div>

    <!-- (NUEVO) Estado de Error -->
    <div v-else-if="error || !form" class="text-center p-10 bg-red-50 rounded-xl shadow-lg border border-red-300">
      <h1 class="text-3xl font-bold text-red-700">Error al Cargar el Producto</h1>
      <p class="text-gray-600 mt-2">{{ error?.statusMessage || 'El producto no pudo ser encontrado.' }}</p>
      <button @click="router.push('/admin/inventario')"
        class="mt-6 px-5 py-2 bg-purple-dark text-white rounded-lg hover:bg-purple-deep transition shadow-lg">
        Volver al Inventario
      </button>
    </div>
    
    <!-- (NUEVO) Formulario Principal -->
    <form v-else @submit.prevent="guardarCambios" class="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-purple-dark">
        <!-- Encabezado -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-purple-dark">Editar Producto</h1>
            <p class="text-lg text-gray-600 mt-1">{{ form.nombre }} (ID: {{ form.id }})</p>
        </div>

        <!-- Mensaje de Éxito/Error al Guardar -->
        <div v-if="saveMessage" 
             :class="saveError ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'"
             class="m-6 p-4 rounded-lg border text-sm font-medium text-center">
            {{ saveMessage }}
        </div>

        <!-- Cuerpo del Formulario -->
        <div class="p-6 md:p-8 space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre del Producto -->
                <div>
                    <label for="nombre" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre del Producto</label>
                    <input v-model="form.nombre" type="text" id="nombre"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                           required />
                </div>
                
                <!-- Tipo de Producto -->
                <div>
                    <label for="tipo" class="block text-sm font-semibold text-dark-primary-blue mb-2">Tipo de Producto</label>
                    <select v-model="form.tipo" id="tipo"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep bg-white">
                        <option value="Urna">Urna</option>
                        <option value="Servicio">Servicio</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Stock -->
                <div>
                    <label for="stock" class="block text-sm font-semibold text-dark-primary-blue mb-2">Stock Actual</label>
                    <input v-model.number="form.stock" type="number" id="stock"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                           required />
                </div>
                
                <!-- Precio -->
                <div>
                    <label for="precio" class="block text-sm font-semibold text-dark-primary-blue mb-2">Precio Unitario (CLP)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input v-model.number="form.precio" type="number" id="precio"
                               class="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                               required />
                    </div>
                </div>

                <!-- Disponibilidad -->
                <div>
                    <label for="disponible" class="block text-sm font-semibold text-dark-primary-blue mb-2">Disponibilidad</label>
                    <select v-model="form.disponible" id="disponible"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep bg-white">
                        <option :value="true">Disponible</option>
                        <option :value="false">Agotado / No Disponible</option>
                    </select>
                </div>
            </div>

            <!-- Proveedor (Opcional) -->
            <div>
                <label for="proveedor" class="block text-sm font-semibold text-dark-primary-blue mb-2">Proveedor</label>
                <select v-model="form.id_proveedor" id="proveedor"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep bg-white">
                    <option :value="null">-- Sin Proveedor --</option>
                    <!-- (NUEVO) Cargar lista de proveedores -->
                    <option v-for="proveedor in proveedores" :key="proveedor.id_proveedor" :value="proveedor.id_proveedor">
                        {{ proveedor.proveedor }}
                    </option>
                </select>
            </div>
            
        </div>

        <!-- Acciones -->
        <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" @click="router.push('/admin/inventario')" 
                    class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150">
                Cancelar
            </button>
            <button type="submit" 
                    :disabled="isSaving"
                    class="px-5 py-2 bg-purple-deep text-white rounded-lg hover:bg-purple-light transition duration-150 shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
        </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 1. Proteger esta página


const route = useRoute();
const router = useRouter();
const productoId = ref(route.query.id as string);

// --- (NUEVO) Definir Tipos ---
interface ProductoForm {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  disponible: boolean;
  tipo: string;
  id_proveedor: number | null;
}
interface Proveedor {
    id_proveedor: number;
    proveedor: string;
}

// --- Estado del Formulario ---
const form = ref<ProductoForm | null>(null);
const isSaving = ref(false);
const saveMessage = ref('');
const saveError = ref(false);

// --- Carga de Datos ---

// 2. Cargar el producto a editar (usando la API GET)
const { data: loadedData, pending, error } = await useAsyncData<ProductoForm>(
  'producto-detalle',
  () => {
    if (!productoId.value) throw createError({ statusCode: 400, statusMessage: 'Falta ID de producto' });
    return $fetch('/api/admin/producto-detalle', { query: { id: productoId.value } })
  },
  { watch: [productoId] }
);

// (NUEVO) Cargar la lista de proveedores para el menú desplegable
// (Esta es una API simple que no hemos creado, pero podemos hacerla ahora o en el futuro)
// Por ahora, usaremos datos de prueba para los proveedores
const { data: proveedores } = await useAsyncData('lista-proveedores', 
  () => Promise.resolve([
      { id_proveedor: 1, proveedor: 'Insumos Patitas' },
      { id_proveedor: 2, proveedor: 'Urnas del Sur' }
  ])
  // Reemplazar con: () => $fetch('/api/admin/lista-proveedores')
);

// 3. Rellenar el formulario reactivo cuando los datos carguen
watchEffect(() => {
  if (loadedData.value) {
    // Usamos 'structuredClone' para evitar editar los datos cargados directamente
    form.value = structuredClone(loadedData.value);
  }
});

// --- Guardar Cambios ---

// 4. Función para guardar (usando la API PUT)
const guardarCambios = async () => {
  if (!form.value) return;

  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = false;

  try {
    await $fetch('/api/admin/editar-producto', {
      method: 'PUT',
      body: form.value
    });

    saveMessage.value = '¡Producto actualizado con éxito! Redirigiendo...';
    setTimeout(() => {
      router.push('/admin/inventario');
    }, 2000);

  } catch (err: any) {
    isSaving.value = false;
    saveError.value = true;
    saveMessage.value = err.data?.statusMessage || 'Error al guardar el producto.';
  }
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

/* Estado deshabilitado */
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }

/* Colores de Mensajes */
.bg-green-100 { background-color: #d4edda; } 
.text-green-700 { color: #155724; } 
.border-green-300 { border-color: #c3e6cb; }
.bg-red-100 { background-color: #f8d7da; }
.text-red-700 { color: #721c24; }
.border-red-300 { border-color: #f5c6cb; }
.bg-red-50 { background-color: #fef2f2; }
</style>