<template>
  <div class="container mx-auto px-4 py-8 min-h-screen bg-gray-50 font-sans">
    
    <h1 class="text-4xl font-bold mb-8 text-dark-primary-blue">Gestión de Inventario</h1>
    <p class="text-gray-600 mb-6">Utilice este formulario para agregar nuevos productos (urnas o accesorios).</p>

    <button @click="router.back()" class="text-cyan-700 hover:text-cyan-800 transition duration-150 mb-6 flex items-center">
      <font-awesome-icon icon="fas fa-arrow-left" class="mr-2" /> Volver al Dashboard
    </button>


    <div class="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6 text-dark-primary-blue border-b pb-2">Agregar Nuevo Ítem</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <div>
          <label for="tipo" class="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
          <select v-model="form.tipo_producto" id="tipo" required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-700">
            <option value="Urna">Urna</option>
            <option value="Accesorio">Accesorio</option>
          </select>
        </div>

        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Urna/Accesorio:</label>
          <input type="text" v-model="form.nombre_producto" id="nombre" required
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-700">
        </div>

        <div>
          <label for="proveedor" class="block text-sm font-medium text-gray-700 mb-1">Proveedor:</label>
          <input type="text" v-model="form.proveedor" id="proveedor" required
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-700">
        </div>

        <div>
          <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada:</label>
          <textarea v-model="form.descripcion" id="descripcion" rows="3" maxlength="300"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-700"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="precio" class="block text-sm font-medium text-gray-700 mb-1">Precio Unitario (CLP):</label>
                <input type="number" v-model.number="form.precio_unitario" id="precio" required min="1000"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-700">
            </div>
            <div>
                <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Stock Disponible:</label>
                <input type="number" v-model.number="form.stock_actual" id="stock" required min="1"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-700">
            </div>
        </div>

        <button type="submit" 
                class="w-full bg-cyan-700 text-white py-3 rounded-lg font-semibold hover:bg-cyan-800 transition duration-150 shadow-md">
          <font-awesome-icon icon="fas fa-save" class="mr-2" /> Guardar y Publicar
        </button>
      </form>

      <p v-if="message" :class="messageClass" class="mt-4 p-3 rounded-lg text-sm text-center">{{ message }}</p>

      <div class="mt-6 text-center">
        <NuxtLink to="/admin/dashboard" class="text-cyan-700 hover:underline">
          ← Volver al Dashboard
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
// Añadido faSave para el botón de guardar
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'; 

library.add(faArrowLeft, faSave);

const router = useRouter();

// Estado del formulario, incluyendo el nuevo campo 'proveedor'
const form = ref({
  nombre_producto: '',
  tipo_producto: 'Urna',
  proveedor: '', // Nuevo campo
  descripcion: '',
  precio_unitario: 0,
  stock_actual: 1
});

const message = ref('');
const messageClass = ref('');

// Simulación de envío del formulario
const handleSubmit = () => {
  if (form.value.stock_actual <= 0) {
    message.value = 'Advertencia: El stock debe ser mayor a cero.';
    messageClass.value = 'bg-yellow-100 text-yellow-800';
    return;
  }
  
  // 🛑 Lógica real: POST /server/api/admin/inventario.post.ts 
  // El backend insertaría el nuevo Producto en PostgreSQL, incluyendo el FK id_proveedor
  
  message.value = `¡Ítem agregado! Producto: ${form.value.nombre_producto}, Proveedor: ${form.value.proveedor}.`;
  messageClass.value = 'bg-green-100 text-green-800';

  // Limpiar el formulario
  form.value = {
    nombre_producto: '',
    tipo_producto: 'Urna',
    proveedor: '',
    descripcion: '',
    precio_unitario: 0,
    stock_actual: 1
  };
};

definePageMeta({
  title: 'Gestión de Inventario'
});
</script>

<style scoped>
/* Consistencia de color */
.text-dark-primary-blue {
    color: #34495e;
}
.bg-dark-primary-blue {
    background-color: #34495e;
}
.border-dark-primary-blue {
    border-color: #34495e;
}
.text-cyan-700 {
    color: #17a2b8;
}
.hover\:text-cyan-800:hover {
    color: #0f869a;
}
.focus\:ring-cyan-700:focus {
    --tw-ring-color: #17a2b8;
}
</style>