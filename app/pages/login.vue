<template>
  <div class="pt-14 py-20 min-h-screen flex justify-center items-start">
    
    <div class="w-full max-w-sm bg-white-subtle p-8 rounded-xl shadow-2xl border-b-8 border-purple-light">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-purple-dark mb-2">
          Iniciar Sesión
        </h1>
        <p class="text-gray-600 font-medium">Inicia sesión con tus credenciales.</p>
      </div>

      <!-- MENSAJE DE ERROR (NUEVO) -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        
        <div class="mb-5">
          <label for="email" class="block text-sm font-semibold text-dark-primary-blue mb-2">Correo Electrónico</label>
          <div class="relative">
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required
              class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="usuario@ejemplo.cl"
              @input="errorMessage = ''"
            />
            <font-awesome-icon icon="fas fa-user" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-semibold text-dark-primary-blue mb-2">Contraseña</label>
          <div class="relative">
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required
              class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="••••••••"
              @input="errorMessage = ''"
            />
            <font-awesome-icon icon="fas fa-lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <!-- BOTÓN ACTUALIZADO CON ESTADO DE CARGA -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-purple-light transition duration-150 shadow-lg shadow-purple-200/50
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>

      </form>

      <div class="mt-8 pt-4 border-t border-gray-200 text-center text-sm">
        <NuxtLink to="/registro" class="text-purple-light hover:text-purple-dark font-semibold transition duration-150">
          ¿No tienes cuenta? Regístrate
        </NuxtLink>
        <span class="text-gray-500 mx-2">|</span>
        <NuxtLink to="/recuperar-contrasena" class="text-purple-light hover:text-purple-dark font-semibold transition duration-150">
          ¿Olvidaste tu contraseña?
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importar useRouter
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faLock);

// --- ESTADO DEL FORMULARIO ---
const email = ref('');
const password = ref('');
const errorMessage = ref(''); // Para mostrar errores de la API
const isLoading = ref(false); // Para deshabilitar el botón
const router = useRouter(); // Para redirigir

// --- FUNCIÓN DE LOGIN (ACTUALIZADA) ---
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 1. Llamar a la API que creamos
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        correo: email.value,
        contraseña: password.value,
      },
    });

    // 2. Éxito
    isLoading.value = false;
    console.log('Login exitoso:', response.user);

    // Opcional: Guardar el usuario en un estado global (ej: useState)
    // const userState = useState('user', () => response.user);

    // 3. Redirigir al dashboard
    router.push('/admin/dashboard');

  } catch (error: any) {
    // 4. Manejar error
    isLoading.value = false;
    console.error('Error en el login:', error);
    
    // 'error.data.statusMessage' es el mensaje que pusimos en createError()
    errorMessage.value = error.data?.statusMessage || 'Error desconocido. Intente de nuevo.';
  }
};

definePageMeta({
    title: 'Iniciar Sesión'
});
</script>

<style scoped>
/* CLASES DE COLOR */
.text-purple-dark { color: #4A235A; } 
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.text-purple-light { color: #6C3483; }

.bg-purple-deep { background-color: #5C2A72; } 
.border-purple-deep { border-color: #5C2A72; } 

.focus\:border-purple-deep:focus { border-color: #5C2A72; }
.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }

.bg-white-subtle { background-color: #F8F4FA; } /* Fondo de tarjeta claro con tinte púrpura */

.text-dark-primary-blue { color: #34495e; } /* Gris Carbón */
/* Sombra Púrpura sutil para el botón */
.shadow-purple-200\/50 { --tw-shadow-color: #e0b4f8; --tw-shadow: var(--tw-shadow-ring-offset-shadow, 0 0 #0000), var(--tw-shadow-ring-shadow, 0 0 #0000), 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color); }

/* (NUEVO) Estilos para el estado deshabilitado del botón */
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
</style>