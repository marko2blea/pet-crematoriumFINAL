<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl pt-20">
    
    <div class="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-3">
        <h1 class="text-4xl font-bold text-purple-dark">
            Editando Memorial: {{ form.nombre || 'Cargando...' }}
        </h1>
    </div>

    <button @click="router.push('/memorial')" class="text-purple-light hover:text-purple-dark transition duration-150 mb-6 flex items-center">
      <font-awesome-icon icon="fas fa-arrow-left" class="mr-2" /> Volver al Memorial
    </button>
    
    <div v-if="!form.id" class="text-center p-10 bg-white-subtle shadow-lg rounded-lg border border-purple-light">
        <p class="text-lg font-semibold text-red-600">No se pudo cargar el registro o el ID es inválido.</p>
        <p class="text-sm text-gray-600 mt-2">Asegúrese de que el memorial exista y regrese al listado.</p>
    </div>

    <div v-else class="bg-white-subtle p-8 rounded-xl shadow-2xl max-w-xl mx-auto border-t-4 border-purple-deep">
      <h2 class="text-2xl font-semibold mb-6 text-purple-dark border-b pb-2">Modificar Registro</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <div>
          <label for="nombre" class="block text-sm font-medium text-purple-dark mb-1">Nombre:</label>
          <input type="text" v-model="form.nombre" id="nombre" required
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="raza" class="block text-sm font-medium text-purple-dark mb-1">Raza:</label>
                <input type="text" v-model="form.raza" id="raza"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
            </div>
            <div>
                <label for="fecha" class="block text-sm font-medium text-purple-dark mb-1">Fecha de Fallecimiento:</label>
                <input type="date" v-model="form.fecha" id="fecha" required
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep">
            </div>
        </div>
        
        <div>
          <label for="dedicatoria" class="block text-sm font-medium text-purple-dark mb-1">Dedicatoria (Máx. 100 caracteres):</label>
          <textarea v-model="form.dedicatoria" id="dedicatoria" rows="3" maxlength="100"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep"></textarea>
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
import { useRouter, useRoute } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 

library.add(faSave, faArrowLeft);

const router = useRouter();
const route = useRoute();

// Estado del formulario
const form = ref({
  id: 0,
  nombre: '',
  raza: '',
  fecha: '',
  dedicatoria: ''
});

const message = ref('');
const messageClass = ref('');

// --- Lógica de Carga Inicial ---
onMounted(() => {
    // 1. Obtener ID de la URL query (asumiendo /editar-memorial?id=X)
    const memorialId = route.query.id ? parseInt(route.query.id as string) : null;
    
    if (memorialId) {
        // 2. Simular la carga de datos
        const dummyData = simulateFetchMemorial(memorialId);
        
        if (dummyData) {
            form.value = dummyData;
        } else {
            form.value.id = 0; // Marcar como no encontrado
        }
    } else {
        form.value.id = 0; 
    }
});

// SIMULACIÓN DE FETCH DE DATOS EXISTENTES (ID: 1, 2, 3, 4)
const simulateFetchMemorial = (id: number) => {
    const mockDB = [
        { id: 1, nombre: 'Max', raza: 'Labrador Retriever', fecha: '2025-10-25', dedicatoria: 'Nuestro gran amigo y guardián. Su recuerdo es eterno.' },
        { id: 2, nombre: 'Luna', raza: 'Gata Siamesa', fecha: '2025-09-15', dedicatoria: 'La más dulce de las compañeras, llenó nuestra casa de ronroneos.' },
        { id: 3, nombre: 'Toby', raza: 'Poodle Toy', fecha: '2025-10-01', dedicatoria: 'Pequeño en tamaño, gigante en amor. Siempre te recordaremos.' },
        { id: 4, nombre: 'Rocky', raza: 'Pastor Alemán', fecha: '2025-08-10', dedicatoria: 'Fuerza y lealtad hasta el final. Gracias por cada aventura.' },
    ];
    return mockDB.find(pet => pet.id === id) || null;
};


// Simulación de envío del formulario (PUT/PATCH)
const handleSubmit = () => {
  // 🛑 Lógica real: PUT /server/api/admin/memorial/:id (Actualizar en tabla)
  
  message.value = `✅ ¡Memorial de ${form.value.nombre} (ID: ${form.value.id}) actualizado con éxito!`;
  messageClass.value = 'bg-green-100 text-green-800'; 

  // Redirigir al memorial después de 2 segundos
  setTimeout(() => {
      router.push('/memorial');
  }, 2000);
};

definePageMeta({
  title: 'Editar Memorial'
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
.text-red-600 { color: #DC2626; } /* Color para mensajes de error/notificación */
</style>