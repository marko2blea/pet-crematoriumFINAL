<template>
  <div class="pt-14 py-20 min-h-screen flex justify-center items-start">
    
    <div class="w-full max-w-lg bg-white-subtle p-8 rounded-xl shadow-2xl border-b-8 border-purple-light">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-purple-dark mb-2">
          Únete a la Familia
        </h1>
        <p class="text-gray-600 font-medium">Crea tu cuenta de cliente en San Antonio.</p>
      </div>

      <!-- MENSAJE DE ERROR/ÉXITO (NUEVO) -->
      <div v-if="message" class="mb-4 p-3 rounded-lg text-center text-sm"
           :class="isError ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'">
        {{ message }}
      </div>

      <form @submit.prevent="handleRegister">
        
        <div class="grid md:grid-cols-2 gap-4 mb-5">
          <div>
            <label for="firstName" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre</label>
            <input 
              id="firstName" 
              v-model="nombre" 
              type="text" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="Tu Nombre"
              @input="clearMessages"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-semibold text-dark-primary-blue mb-2">Apellido</label>
            <input 
              id="lastName" 
              v-model="apellido_paterno" 
              type="text" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="Tu Apellido"
              @input="clearMessages"
            />
          </div>
        </div>
        
        <div class="mb-5">
          <label for="phoneNumber" class="block text-sm font-semibold text-dark-primary-blue mb-2">Teléfono de Contacto (Ej: 912345678)</label>
          <div class="relative">
            <input 
              id="phoneNumber" 
              v-model="telefono" 
              type="tel" 
              required
              class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="912345678"
              pattern="[0-9]{9}"
              title="Debe ser un número de 9 dígitos (ej: 912345678)"
              @input="clearMessages"
            />
            <font-awesome-icon icon="fas fa-phone" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div class="mb-5">
          <label for="email" class="block text-sm font-semibold text-dark-primary-blue mb-2">Correo Electrónico</label>
          <div class="relative">
            <input 
              id="email" 
              v-model="correo" 
              type="email" 
              required
              class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="usuario@ejemplo.cl"
              @input="clearMessages"
            />
            <font-awesome-icon icon="fas fa-envelope" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="password" class="block text-sm font-semibold text-dark-primary-blue mb-2">Contraseña</label>
            <div class="relative">
              <input 
                id="password" 
                v-model="contraseña" 
                type="password" 
                required
                minlength="8"
                class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
                placeholder="Mínimo 8 caracteres"
                @input="clearMessages"
              />
              <font-awesome-icon icon="fas fa-key" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-dark-primary-blue mb-2">Confirmar Contraseña</label>
            <input 
              id="confirmPassword" 
              v-model="confirmPassword" 
              type="password" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="Repetir contraseña"
              @input="clearMessages"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-purple-light transition duration-150 shadow-lg shadow-purple-200/50
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>

      </form>

      <div class="mt-8 pt-4 border-t border-gray-200 text-center text-sm">
        <NuxtLink to="/login" class="text-purple-light hover:text-purple-dark font-semibold transition duration-150">
          ¿Ya tienes cuenta? Inicia sesión
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importar useRouter
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faPhone } from '@fortawesome/free-solid-svg-icons';

library.add(faEnvelope, faKey, faPhone);

// --- ESTADO DEL FORMULARIO ---
// Los nombres coinciden con el 'body' esperado en la API
const nombre = ref('');
const apellido_paterno = ref('');
const telefono = ref('');
const correo = ref('');
const contraseña = ref('');
const confirmPassword = ref(''); // Solo para validación frontend

// --- ESTADO DE UI ---
const message = ref('');
const isError = ref(false);
const isLoading = ref(false);
const router = useRouter();

const clearMessages = () => {
  message.value = '';
  isError.value = false;
};

// --- FUNCIÓN DE REGISTRO (ACTUALIZADA) ---
const handleRegister = async () => {
  clearMessages();
  
  // 1. Validar contraseña
  if (contraseña.value !== confirmPassword.value) {
    message.value = 'Las contraseñas no coinciden.';
    isError.value = true;
    return;
  }
  
  if (contraseña.value.length < 8) {
    message.value = 'La contraseña debe tener al menos 8 caracteres.';
    isError.value = true;
    return;
  }

  isLoading.value = true;

  try {
    // 2. Llamar a la API de registro
    const response = await $fetch('/api/auth/registro', {
      method: 'POST',
      body: {
        nombre: nombre.value,
        apellido_paterno: apellido_paterno.value,
        telefono: telefono.value, // La API lo parseará a Int
        correo: correo.value,
        contraseña: contraseña.value,
      },
    });

    // 3. Éxito
    isLoading.value = false;
    isError.value = false;
    message.value = '¡Usuario creado! Redirigiendo al login...';

    // 4. Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error: any) {
    // 5. Manejar error
    isLoading.value = false;
    isError.value = true;
    console.error('Error en el registro:', error);
    
    // 'error.data.statusMessage' es el mensaje de la API (ej: "El correo ya existe")
    message.value = error.data?.statusMessage || 'Error desconocido. Intente de nuevo.';
  }
};

definePageMeta({
    title: 'Crear Cuenta'
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