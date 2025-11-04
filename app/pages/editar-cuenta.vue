<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl pt-20">
    
    <h1 class="text-4xl font-bold mb-8 text-purple-dark">Configuración de la Cuenta</h1>
    <p class="text-gray-600 mb-6">Actualice su información personal y credenciales de acceso.</p>

    <button @click="router.push('/admin')" class="text-purple-light hover:text-purple-dark transition duration-150 mb-6 flex items-center">
      <font-awesome-icon icon="fas fa-arrow-left" class="mr-2" /> Volver al Panel
    </button>


    <div class="bg-white-subtle p-8 rounded-xl shadow-2xl max-w-xl mx-auto border-t-4 border-purple-deep">
      <h2 class="text-2xl font-semibold mb-6 text-purple-dark border-b pb-2">Datos de Usuario</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <div>
          <label for="nombre" class="block text-sm font-medium text-purple-dark mb-1">Nombre Completo:</label>
          <input type="text" v-model="form.nombre" id="nombre" required
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-purple-dark mb-1">Correo Electrónico (Usuario):</label>
          <input type="email" v-model="form.email" id="email" required
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
        </div>

        <div>
          <label for="telefono" class="block text-sm font-medium text-purple-dark mb-1">Teléfono:</label>
          <input type="tel" v-model="form.telefono" id="telefono"
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
        </div>
        
        <div class="pt-4 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-purple-dark mb-3">Cambiar Contraseña</h3>
            <div>
                <label for="password" class="block text-sm font-medium text-purple-dark mb-1">Nueva Contraseña (Dejar vacío para no cambiar):</label>
                <input type="password" v-model="form.password" id="password"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
            </div>
        </div>
        
        <button type="submit" 
                class="w-full bg-purple-deep text-white py-3 rounded-lg font-semibold hover:bg-purple-light transition duration-150 shadow-md mt-6">
          <font-awesome-icon icon="fas fa-save" class="mr-2" /> Guardar Cambios
        </button>
      </form>

      <p v-if="message" :class="messageClass" class="mt-4 p-3 rounded-lg text-sm text-center">{{ message }}</p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 

library.add(faSave, faArrowLeft);

const router = useRouter();

interface UserAccount {
    nombre: string;
    email: string;
    telefono: string;
    password: '';
}

// Estado del formulario
const form = ref<UserAccount>({
  nombre: '',
  email: '',
  telefono: '',
  password: ''
});

const message = ref('');
const messageClass = ref('');

// --- Lógica de Carga Inicial ---
onMounted(() => {
    // Simular la carga de datos del usuario actual (API call GET /api/admin/cuenta)
    const dummyUserData: Omit<UserAccount, 'password'> = {
        nombre: 'Administrador Principal',
        email: 'admin@sanantonio.cl',
        telefono: '987654321',
    };
    
    form.value.nombre = dummyUserData.nombre;
    form.value.email = dummyUserData.email;
    form.value.telefono = dummyUserData.telefono;
    // La contraseña nunca se carga, solo se usa el campo para establecer una nueva.
});


// Simulación de envío del formulario (PUT/PATCH)
const handleSubmit = () => {
  // 🛑 Lógica real: PATCH /server/api/admin/cuenta (Actualizar datos)
  
  message.value = `✅ ¡Datos de cuenta de ${form.value.nombre} actualizados con éxito!`;
  messageClass.value = 'bg-green-100 text-green-800'; 

  // Opcional: Redirigir al dashboard después de 2 segundos
  setTimeout(() => {
      router.push('/admin');
  }, 2000);
};

definePageMeta({
  title: 'Editar Cuenta'
});
</script>

<style scoped>
/* CLASES DE COLOR (Para consistencia visual) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; }
.bg-purple-light { background-color: #6C3483; }
.hover\:bg-purple-light:hover { background-color: #6C3483; }

.bg-purple-deep { background-color: #5C2A72; }
.border-purple-deep { border-color: #5C2A72; }

.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }
.focus\:border-purple-deep:focus { border-color: #5C2A72; }

.bg-white-subtle { background-color: #F8F4FA; }
.bg-green-100 { background-color: #D1FAE5; }
.text-green-800 { color: #065F46; }
</style>