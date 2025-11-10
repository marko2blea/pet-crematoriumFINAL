<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">

    <!-- Formulario Principal -->
    <form @submit.prevent="guardarCambios" class="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-purple-dark">
        <!-- Encabezado -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-purple-dark">Agregar Nuevo Producto</h1>
            <p class="text-lg text-gray-600 mt-1">Complete los detalles del nuevo ítem de inventario.</p>
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
                    <label for="stock" class="block text-sm font-semibold text-dark-primary-blue mb-2">Stock Inicial</label>
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
                {{ isSaving ? 'Creando...' : 'Crear Producto' }}
            </button>
        </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 1. Proteger esta página

const router = useRouter();

// --- Tipos ---
interface Proveedor {
    id_proveedor: number;
    proveedor: string;
}

// --- Estado del Formulario (Inicializado vacío) ---
const form = ref({
  nombre: '',
  stock: 0,
  precio: 0,
  disponible: true,
  tipo: 'Urna', // Valor por defecto
  id_proveedor: null as number | null,
});

const isSaving = ref(false);
const saveMessage = ref('');
const saveError = ref(false);

// --- Carga de Datos (Solo Proveedores) ---
const { data: proveedores } = await useAsyncData('lista-proveedores', 
  () => Promise.resolve([
      { id_proveedor: 1, proveedor: 'Insumos Patitas' },
      { id_proveedor: 2, proveedor: 'Urnas del Sur' }
  ])
  // Reemplazar con: () => $fetch('/api/admin/lista-proveedores')
);


// --- Guardar Cambios ---
const guardarCambios = async () => {
  if (!form.value) return;

  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = false;

  try {
    // 4. Llamar a la nueva API (POST)
    await $fetch('/api/admin/agregar-producto', {
      method: 'POST',
      body: form.value
    });

    saveMessage.value = '¡Producto creado con éxito! Redirigiendo...';
    setTimeout(() => {
      router.push('/admin/inventario');
    }, 2000);

  } catch (err: any) {
    isSaving.value = false;
    saveError.value = true;
    saveMessage.value = err.data?.statusMessage || 'Error al crear el producto.';
  }
};
</script>

<style scoped>
/* Estilos (Copiados de editar-producto.vue) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }
.text-dark-primary-blue { color: #34495e; }
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
.bg-green-100 { background-color: #d4edda; } 
.text-green-700 { color: #155724; } 
.border-green-300 { border-color: #c3e6cb; }
.bg-red-100 { background-color: #f8d7da; }
.text-red-700 { color: #721c24; }
.border-red-300 { border-color: #f5c6cb; }
</style>