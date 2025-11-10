<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">

    <!-- Formulario Principal -->
    <form @submit.prevent="guardarCambios" class="max-w-xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-purple-dark">
        <!-- Encabezado -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-purple-dark">Crear Nuevo Usuario</h1>
            <p class="text-lg text-gray-600 mt-1">Crear una cuenta (Cliente o Admin) manualmente.</p>
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
                <!-- Nombre -->
                <div>
                    <label for="nombre" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre</label>
                    <input v-model="form.nombre" type="text" id="nombre"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                           required />
                </div>
                <!-- Apellido -->
                <div>
                    <label for="apellido" class="block text-sm font-semibold text-dark-primary-blue mb-2">Apellido</label>
                    <input v-model="form.apellido_paterno" type="text" id="apellido"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                           required />
                </div>
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-semibold text-dark-primary-blue mb-2">Correo Electrónico</label>
                <input v-model="form.correo" type="email" id="email"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                       placeholder="usuario@ejemplo.cl"
                       required />
            </div>

            <!-- Contraseña -->
            <div>
                <label for="password" class="block text-sm font-semibold text-dark-primary-blue mb-2">Contraseña Temporal</label>
                <input v-model="form.contraseña" type="password" id="password"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                       placeholder="Mínimo 8 caracteres"
                       minlength="8"
                       required />
            </div>
            
            <!-- Selector de Rol -->
            <div>
                <label for="rol" class="block text-sm font-semibold text-dark-primary-blue mb-2">Asignar Rol</label>
                <select v-model="form.id_rol" id="rol"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep bg-white"
                        required>
                    <option :value="null">-- Seleccione un Rol --</option>
                    <!-- (NUEVO) Carga los roles (Cliente, Admin) desde la API -->
                    <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
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
                {{ isSaving ? 'Creando...' : 'Crear Usuario' }}
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
interface Rol {
  id_rol: number;
  nombre_rol: string | null;
}

// --- Estado del Formulario (Inicializado vacío) ---
const form = ref({
  nombre: '',
  apellido_paterno: '',
  correo: '',
  contraseña: '',
  id_rol: null as number | null,
});

const isSaving = ref(false);
const saveMessage = ref('');
const saveError = ref(false);

// --- Carga de Datos (Solo Roles) ---
// (NUEVO) Cargar la lista de roles (Cliente, Admin) desde la API
const { data: roles, error: rolesError } = await useAsyncData<Rol[]>(
  'lista-roles-para-admin',
  () => $fetch('/api/roles'), // Usamos la API que ya existe
  { default: () => [] }
);
if (rolesError.value) {
    saveMessage.value = 'Error al cargar la lista de roles.';
    saveError.value = true;
}

// --- Guardar Cambios ---
const guardarCambios = async () => {
  if (!form.value.id_rol) {
    saveError.value = true;
    saveMessage.value = 'Debe seleccionar un rol.';
    return;
  }
  if (form.value.contraseña.length < 8) {
    saveError.value = true;
    saveMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
    return;
  }

  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = false;

  try {
    // 4. Llamar a la nueva API (POST)
    await $fetch('/api/admin/agregar-usuario', {
      method: 'POST',
      body: form.value
    });

    saveMessage.value = '¡Usuario creado con éxito! Redirigiendo...';
    setTimeout(() => {
      router.push('/admin/gestionar-usuario');
    }, 2000);

  } catch (err: any) {
    isSaving.value = false;
    saveError.value = true;
    saveMessage.value = err.data?.statusMessage || 'Error al crear el usuario.';
  }
};
</script>

<style scoped>
/* Estilos (Copiados de editar-usuario.vue) */
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