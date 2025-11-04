<template>
  <div class="pt-14 py-20 min-h-screen flex justify-center items-start">
    
    <div class="w-full max-w-lg bg-white-subtle p-8 rounded-xl shadow-2xl border-b-8 border-purple-light">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-purple-dark mb-2">
          Únete a la Familia
        </h1>
        <p class="text-gray-600 font-medium">Crea tu cuenta de cliente en San Antonio.</p>
      </div>

      <form @submit.prevent="handleRegister">
        
        <div class="grid md:grid-cols-2 gap-4 mb-5">
          <div>
            <label for="firstName" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre</label>
            <input 
              id="firstName" 
              v-model="firstName" 
              type="text" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="Tu Nombre"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-semibold text-dark-primary-blue mb-2">Apellido</label>
            <input 
              id="lastName" 
              v-model="lastName" 
              type="text" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="Tu Apellido"
            />
          </div>
        </div>
        
        <div class="mb-5">
          <label for="phoneNumber" class="block text-sm font-semibold text-dark-primary-blue mb-2">Teléfono de Contacto</label>
          <div class="relative">
            <input 
              id="phoneNumber" 
              v-model="phoneNumber" 
              type="tel" 
              required
              class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
              placeholder="Ej: +56 9 1234 5678"
            />
            <font-awesome-icon icon="fas fa-phone" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

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
                v-model="password" 
                type="password" 
                required
                class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep transition duration-150 text-gray-800"
                placeholder="Mínimo 8 caracteres"
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
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-purple-light transition duration-150 shadow-lg shadow-purple-200/50"
        >
          Crear Cuenta
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
import { library } from '@fortawesome/fontawesome-svg-core';
// Se agrega faPhone para el campo de teléfono
import { faEnvelope, faKey, faPhone } from '@fortawesome/free-solid-svg-icons';

library.add(faEnvelope, faKey, faPhone); // Incluido en la librería

const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref(''); // NUEVO: Estado para el teléfono
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = () => {
  console.log('Intento de Registro con:', email.value, 'y teléfono:', phoneNumber.value);
  alert('Simulación de registro exitoso.');
  // Aquí se llamaría a la API de registro y se redirigiría.
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
</style>