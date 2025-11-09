<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">

    <!-- Estado de Carga -->
    <div v-if="pending" class="text-center p-10 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-dark-primary-blue">
        Cargando datos del usuario...
      </h1>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error || !loadedData" class="text-center p-10 bg-red-50 rounded-xl shadow-lg border border-red-300">
      <h1 class="text-3xl font-bold text-red-700">Error al Cargar el Usuario</h1>
      <p class="text-gray-600 mt-2">{{ error?.statusMessage || 'El usuario no pudo ser encontrado.' }}</p>
      <button @click="router.push('/admin/gestionar-usuario')"
        class="mt-6 px-5 py-2 bg-purple-dark text-white rounded-lg hover:bg-purple-deep transition shadow-lg">
        Volver al Listado
      </button>
    </div>
    
    <!-- Formulario Principal -->
    <form v-else @submit.prevent="guardarCambios" class="max-w-xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-purple-dark">
        <!-- Encabezado -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-purple-dark">Editar Rol de Usuario</h1>
            <p v-if="loadedData.usuario" class="text-lg text-gray-600 mt-1">{{ loadedData.usuario.nombre }} {{ loadedData.usuario.apellido_paterno }}</p>
            <p v-if="loadedData.usuario" class="text-sm font-mono text-purple-deep">{{ loadedData.usuario.correo }}</P>
        </div>

        <!-- Mensaje de Éxito/Error al Guardar -->
        <div v-if="saveMessage" 
             :class="saveError ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'"
             class="m-6 p-4 rounded-lg border text-sm font-medium text-center">
            {{ saveMessage }}
        </div>

        <!-- Cuerpo del Formulario -->
        <div class="p-6 md:p-8 space-y-6">

            <!-- Selector de Rol -->
            <div>
                <label for="rol" class="block text-sm font-semibold text-dark-primary-blue mb-2">Asignar Rol</label>
                <!-- Este 'select' se rellena con los datos de la API -->
                <select v-if="form" v-model="form.id_rol" id="rol"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep bg-white">
                    <option :value="null">-- Seleccione un Rol --</option>
                    <option v-for="rol in loadedData.rolesDisponibles" :key="rol.id_rol" :value="rol.id_rol">
                        {{ rol.nombre_rol }}
                    </option>
                </select>
            </div>
            
        </div>

        <!-- Acciones -->
        <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" @click="router.push('/admin/gestionar-usuario')" 
                    class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150">
                Cancelar
            </button>
            <button type="submit" 
                    :disabled="isSaving"
                    class="px-5 py-2 bg-purple-deep text-white rounded-lg hover:bg-purple-light transition duration-150 shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSaving ? 'Guardando...' : 'Asignar Rol' }}
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
const usuarioId = ref(route.query.id as string);

// --- Definir Tipos ---
interface Usuario {
  id_usuario: number;
  nombre: string | null;
  apellido_paterno: string | null;
  correo: string | null;
  id_rol: number | null;
}
interface Rol {
  id_rol: number;
  nombre_rol: string | null;
}
interface LoadedData {
  usuario: Usuario;
  rolesDisponibles: Rol[];
}
interface FormState {
    id: number;
    id_rol: number | null;
}

// --- Estado del Formulario ---
const form = ref<FormState | null>(null);
const isSaving = ref(false);
const saveMessage = ref('');
const saveError = ref(false);

// --- Carga de Datos ---
const { data: loadedData, pending, error } = await useAsyncData<LoadedData>(
  'usuario-detalle-roles',
  () => {
    if (!usuarioId.value) throw createError({ statusCode: 400, statusMessage: 'Falta ID de usuario' });
    // 2. Llamar a la API GET
    return $fetch('/api/admin/usuario-detalle', { query: { id: usuarioId.value } })
  },
  { watch: [usuarioId] }
);

// 3. Rellenar el formulario reactivo cuando los datos carguen
watchEffect(() => {
  if (loadedData.value && loadedData.value.usuario) {
    form.value = {
      id: loadedData.value.usuario.id_usuario,
      id_rol: loadedData.value.usuario.id_rol,
    };
  }
});

// --- Guardar Cambios ---
const guardarCambios = async () => {
  if (!form.value || !form.value.id_rol) {
    saveError.value = true;
    saveMessage.value = 'Debe seleccionar un rol.';
    return;
  }

  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = false;

  try {
    // 4. Llamar a la API PUT
    await $fetch('/api/admin/editar-usuario', {
      method: 'PUT',
      body: form.value
    });

    saveMessage.value = '¡Rol actualizado con éxito! Redirigiendo...';
    setTimeout(() => {
      router.push('/admin/gestionar-usuario');
    }, 2000);

  } catch (err: any) {
    isSaving.value = false;
    saveError.value = true;
    saveMessage.value = err.data?.statusMessage || 'Error al guardar el rol.';
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
.bg-red-50 { background-color: #fef2f2; }
</style>