<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">

    <!-- Carga/Error (Si no hay usuario, el middleware ya lo redirigió) -->
    <div v-if="!form" class="text-center p-10 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-dark-primary-blue">
        Cargando perfil...
      </h1>
    </div>
    
    <!-- Formulario Principal -->
    <form v-else @submit.prevent="guardarPerfil" class="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-purple-dark">
        <!-- Encabezado -->
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-purple-dark">Editar Mi Cuenta</h1>
            <p class="text-lg text-gray-600 mt-1">Actualiza tu información personal y de contacto.</p>
            <p class="text-sm font-mono text-purple-deep">{{ form.correo }} (No editable)</p>
        </div>

        <!-- Mensaje de Éxito/Error al Guardar -->
        <div v-if="saveMessage" 
             :class="saveError ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'"
             class="m-6 p-4 rounded-lg border text-sm font-medium text-center">
            {{ saveMessage }}
        </div>

        <!-- Cuerpo del Formulario -->
        <div class="p-6 md:p-8 space-y-6">

            <h3 class="text-xl font-semibold text-purple-deep border-b pb-2">Información Personal</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Nombre -->
                <div>
                    <label for="nombre" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre</label>
                    <input v-model="form.nombre" type="text" id="nombre"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                           required />
                </div>
                <!-- Apellido Paterno -->
                <div>
                    <label for="apellido_paterno" class="block text-sm font-semibold text-dark-primary-blue mb-2">Apellido Paterno</label>
                    <input v-model="form.apellido_paterno" type="text" id="apellido_paterno"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                           required />
                </div>
                <!-- Apellido Materno -->
                <div>
                    <label for="apellido_materno" class="block text-sm font-semibold text-dark-primary-blue mb-2">Apellido Materno</label>
                    <input v-model="form.apellido_materno" type="text" id="apellido_materno"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep" />
                </div>
            </div>

            <h3 class="text-xl font-semibold text-purple-deep border-b pb-2 mt-6">Información de Contacto</h3>
             <!-- Teléfono -->
            <div>
                <label for="telefono" class="block text-sm font-semibold text-dark-primary-blue mb-2">Teléfono</label>
                <input v-model="form.telefono" type="tel" id="telefono"
                       placeholder="912345678"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Región -->
                <div>
                    <label for="region" class="block text-sm font-semibold text-dark-primary-blue mb-2">Región</label>
                    <input v-model="form.region" type="text" id="region"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep" />
                </div>
                <!-- Comuna -->
                <div>
                    <label for="comuna" class="block text-sm font-semibold text-dark-primary-blue mb-2">Comuna</label>
                    <input v-model="form.comuna" type="text" id="comuna"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep" />
                </div>
            </div>
             <!-- Dirección -->
            <div>
                <label for="direccion" class="block text-sm font-semibold text-dark-primary-blue mb-2">Dirección</label>
                <input v-model="form.direccion" type="text" id="direccion"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep" />
            </div>
            
        </div>

        <!-- Acciones -->
        <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" @click="router.back()" 
                    class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150">
                Cancelar
            </button>
            <button type="submit" 
                    :disabled="isSaving"
                    class="px-5 py-2 bg-purple-deep text-white rounded-lg hover:bg-purple-light transition duration-150 shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSaving ? 'Guardando...' : 'Guardar Perfil' }}
            </button>
        </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../../app/types'; // Importamos el tipo 'User' que ya definimos

// 1. Proteger esta página
definePageMeta({
  middleware: 'auth'
});

const router = useRouter();
const user = useUser(); // <-- 1. Cargar el estado global del usuario

// --- Estado del Formulario ---
const form = ref<Partial<User> | null>(null); // Usamos Partial<User> para el formulario
const isSaving = ref(false);
const saveMessage = ref('');
const saveError = ref(false);

// 2. Rellenar el formulario con los datos del estado global
onMounted(() => {
  if (user.value) {
    // Copiamos los datos del estado global al formulario local
    // (Usamos structuredClone para evitar editar el estado global directamente)
    form.value = structuredClone(user.value);
  } else {
    // Esto no debería pasar gracias al middleware, pero es una salvaguarda
    saveError.value = true;
    saveMessage.value = "Error: No se pudo cargar la información del usuario.";
  }
});


// --- Guardar Cambios ---
const guardarPerfil = async () => {
  if (!form.value) return;

  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = false;

  try {
    // 3. Llamar a la nueva API (PUT)
    const response = await $fetch('/api/usuario/editar-perfil', {
      method: 'PUT',
      body: {
        id_usuario: form.value.id_usuario, // Enviar el ID para la cláusula WHERE
        nombre: form.value.nombre,
        apellido_paterno: form.value.apellido_paterno,
        apellido_materno: form.value.apellido_materno,
        telefono: form.value.telefono,
        region: form.value.region,
        comuna: form.value.comuna,
        direccion: form.value.direccion,
      }
    });

    // 4. (ÉXITO) Actualizar el estado global 'user'
    // Esto hará que el nombre en el layout (default.vue) se actualice al instante.
    user.value = response.user;

    saveMessage.value = '¡Perfil actualizado con éxito!';
    saveError.value = false;

  } catch (err: any) {
    saveError.value = true;
    saveMessage.value = err.data?.statusMessage || 'Error al guardar el perfil.';
  } finally {
    isSaving.value = false;
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