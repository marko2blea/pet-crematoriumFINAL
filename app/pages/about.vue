<template>
  <div class="pt-14 bg-white-subtle">
    <div class="relative w-full h-80 overflow-hidden shadow-xl">
        <div 
            class="absolute inset-0 bg-cover bg-center opacity-30" 
            style="background-image: url('/banner2.avif');" 
            alt="Fondo de huella de mascota"
        ></div>
        <div class="relative z-10 text-white text-center flex flex-col justify-center h-full container mx-auto px-4">
            <h1 class="text-4xl md:text-6xl font-extrabold mb-3 leading-tight drop-shadow-lg text-bd-gold-accent">
                Sobre Nosotros
            </h1>
            <p class="text-xl md:text-2xl font-light max-w-3xl mx-auto drop-shadow-md text-purple-dark text-bold">
                Conoce nuestra historia, valores y el compromiso que tenemos con tu familia.
            </p>
        </div>
    </div>
    
    <div class="container mx-auto px-4 py-16 -mt-10 relative z-20">
      
      <div v-if="feedbackMessage" 
          :class="isError ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'"
          class="mb-6 p-4 rounded-lg border text-sm font-medium text-center max-w-4xl mx-auto">
          {{ feedbackMessage }}
      </div>

      <div v-if="pending" class="text-center py-10 bg-white rounded-xl shadow-md">
          <p class="text-xl text-gray-600 font-semibold">Cargando contenido...</p>
      </div>
      <div v-else-if="error" class="text-center py-10 bg-red-100 rounded-xl shadow-md">
          <p class="text-xl text-red-700 font-semibold">Error al cargar: {{ error.statusMessage }}</p>
      </div>
      <div v-else-if="contentBlocks.length === 0" class="text-center py-10 bg-white rounded-xl shadow-md">
          <p class="text-xl text-gray-600 font-semibold">No hay contenido que mostrar. Un administrador puede añadirlo.</p>
      </div>

      <div v-for="(block, index) in contentBlocks" :key="block.id_block"
          class="bg-white p-8 md:p-12 rounded-xl shadow-xl mb-12 max-w-4xl mx-auto border-t-4"
          :class="block.isEditing ? 'border-purple-deep shadow-2xl' : 'border-gray-200'"
      >
        <div class="flex justify-between items-start mb-4 border-b pb-2">
            <h2 
              class="text-3xl font-bold text-purple-dark"
              :contenteditable="block.isEditing"
              @blur="handleContentUpdate($event, index, 'title')"
              :class="{'border-b-2 border-purple-light': block.isEditing}"
            >
              {{ block.title }}
            </h2>
            
            <div v-if="user && user.id_rol !== 1" class="flex items-center space-x-2 ml-4">
                <button 
                    @click="block.isEditing ? saveBlock(index) : editBlock(index)"
                    class="text-white transition duration-150 p-2 rounded-full shadow-md w-12 h-12"
                    :class="block.isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-dark hover:bg-purple-light'"
                    :title="block.isEditing ? 'Guardar Cambios' : 'Editar Bloque'">
                    <font-awesome-icon :icon="block.isEditing ? 'fas fa-save' : 'fas fa-pencil-alt'" class="text-xl" />
                </button>

                <button v-if="!block.isEditing" @click="removeBlock(index)"
                  class="text-red-600 hover:text-red-800 transition duration-150 p-2 rounded-full hover:bg-gray-100 w-12 h-12"
                  title="Eliminar este bloque">
                  <font-awesome-icon icon="fas fa-trash" class="text-xl" />
                </button>
            </div>
        </div>

        <p 
          class="text-lg text-gray-700 leading-relaxed mb-6"
          :contenteditable="block.isEditing"
          @blur="handleContentUpdate($event, index, 'body')"
          :class="{'border-2 border-dashed border-purple-deep p-2 bg-white': block.isEditing}"
        >
          {{ block.body }}
        </p>
        
        <ul v-if="block.items.length > 0" class="list-disc list-inside text-gray-700 space-y-2 text-lg">
          <li v-for="(item, i) in block.items" :key="i" class="flex items-center">
            <span 
              :contenteditable="block.isEditing" 
              @blur="handleItemUpdate($event, index, i)"
              :class="{'border-b border-purple-light': block.isEditing}"
              class="flex-grow"
            >
              {{ item }}
            </span>
            <button v-if="block.isEditing" @click="removeItem(index, i)"
              class="text-red-500 hover:text-red-700 ml-2" title="Eliminar ítem">
              <font-awesome-icon icon="fas fa-times" class="text-sm" />
            </button>
          </li>
        </ul>
        <button v-if="block.isEditing" @click="addItem(index)"
          class="text-purple-dark hover:text-purple-light transition duration-150 text-sm font-medium mt-4">
          <font-awesome-icon icon="fas fa-plus" class="mr-1" /> Añadir Ítem
        </button>
      </div>

      <div v-if="user && user.id_rol !== 1" class="text-center mt-8 mb-8">
          <button
              @click="addBlock"
              title="Añadir nuevo bloque de contenido"
              :disabled="isLoading"
              class="bg-purple-dark text-white p-4 rounded-full shadow-xl hover:bg-purple-light transition duration-300 transform hover:scale-105 inline-flex items-center justify-center
                    disabled:opacity-50 disabled:cursor-not-allowed">
              <font-awesome-icon icon="fas fa-plus" class="text-3xl" />
          </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watchEffect } from 'vue'; 
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt, faSave, faPlus, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'; 

library.add(faPencilAlt, faSave, faPlus, faTrash, faTimes);

definePageMeta({
  title: 'Sobre Nosotros'
});

// --- (NUEVO) Tipado de la API ---
interface AboutBlock {
    id_block: number;
    title: string;
    body: string;
    items: string[]; // Para la lista de valores
    isEditing: boolean; // Estado de edición (solo en UI)
}

// --- (NUEVO) Carga de Datos y Estado ---
const user = useUser();
const contentBlocks: Ref<AboutBlock[]> = ref([]); // El ref local
const isLoading = ref(false); // Para deshabilitar botones
const feedbackMessage = ref('');
const isError = ref(false);

const { data, pending, error, refresh } = await useAsyncData<AboutBlock[]>(
  'lista-about-content',
  () => $fetch('/api/about-content') // Llama a la API pública
);

// (NUEVO) Poblar el ref local cuando 'useAsyncData' termina
watchEffect(() => {
  if (data.value) {
    contentBlocks.value = data.value.map(block => ({
      ...block,
      isEditing: false 
    }));
  }
});

// --- (MODIFICADO) Funciones de Edición (conectadas a API) ---

const editBlock = (index: number) => {
    if (!contentBlocks.value?.[index]) return; 
    contentBlocks.value[index].isEditing = true;
};

// Guarda los cambios locales en el 'ref'
const handleContentUpdate = (event: Event, index: number, field: 'title' | 'body') => {
    const target = event.target as HTMLElement;
    const newContent = target.innerText.trim();
    if (contentBlocks.value[index]) {
      contentBlocks.value[index][field] = newContent;
    }
};

const handleItemUpdate = (event: Event, blockIndex: number, itemIndex: number) => {
    const target = event.target as HTMLElement;
    const newContent = target.innerText.trim();
    if (contentBlocks.value[blockIndex]?.items[itemIndex] !== undefined) {
      if (!newContent) {
        removeItem(blockIndex, itemIndex); // Borra si está vacío
      } else {
        contentBlocks.value[blockIndex].items[itemIndex] = newContent;
      }
    }
};

const addItem = (blockIndex: number) => {
    if (contentBlocks.value[blockIndex]) {
      contentBlocks.value[blockIndex].items.push('Nuevo ítem');
    }
};

const removeItem = (blockIndex: number, itemIndex: number) => {
    if (contentBlocks.value[blockIndex]?.items[itemIndex] !== undefined) {
      contentBlocks.value[blockIndex].items.splice(itemIndex, 1);
    }
};

// (MODIFICADO) Función 'Save' llama a la API PUT
const saveBlock = async (index: number) => {
    if (!contentBlocks.value[index]) return;
    
    isLoading.value = true;
    feedbackMessage.value = '';
    isError.value = false;
    
    try {
      await $fetch('/api/admin/about-content', {
        method: 'PUT',
        body: contentBlocks.value[index] // Envía el objeto completo actualizado
      });
      
      contentBlocks.value[index].isEditing = false;
      feedbackMessage.value = '¡Bloque guardado con éxito!';
      
    } catch (err: any) {
      isError.value = true;
      feedbackMessage.value = err.data?.statusMessage || 'Error al guardar.';
    } finally {
      isLoading.value = false;
    }
};

// (MODIFICADO) Función 'addBlock' llama a la API POST
const addBlock = async () => {
    isLoading.value = true;
    feedbackMessage.value = '';
    isError.value = false;

    try {
      await $fetch('/api/admin/about-content', {
        method: 'POST',
        body: { // Datos por defecto
          title: 'Nuevo Bloque',
          body: 'Añade una descripción aquí.',
          items: []
        }
      });
      
      feedbackMessage.value = 'Bloque añadido. Refrescando...';
      refresh(); // Vuelve a cargar los datos
      
    } catch (err: any) {
      isError.value = true;
      feedbackMessage.value = err.data?.statusMessage || 'Error al crear el bloque.';
    } finally {
      isLoading.value = false;
    }
};

// (MODMODIFICADO) Función 'removeBlock' llama a la API DELETE
const removeBlock = async (index: number) => {
    if (!contentBlocks.value[index]) return; 
    
    const block = contentBlocks.value[index];
    if (!confirm(`¿Estás seguro de eliminar el bloque "${block.title}"?`)) {
      return;
    }

    isLoading.value = true;
    feedbackMessage.value = '';
    isError.value = false;

    try {
      await $fetch('/api/admin/about-content', {
        method: 'DELETE',
        body: { id_block: block.id_block } // Envía el ID
      });
      
      feedbackMessage.value = 'Bloque eliminado. Refrescando...';
      refresh(); // Vuelve a cargar los datos
      
    } catch (err: any) {
      isError.value = true;
      feedbackMessage.value = err.data?.statusMessage || 'Error al eliminar.';
    } finally {
      isLoading.value = false;
    }
};

</script>

<style scoped>
/* (Estilos sin cambios) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; }
.bg-purple-light { background-color: #6C3483; }
.text-purple-light { color: #6C3483; }
.hover\:bg-purple-light:hover { background-color: #6C3483; }
.border-purple-deep { border-color: #5C2A72; }
.bg-white-subtle { background-color: #F8F4FA; }
.text-bd-gold-accent { 
    color: #FFD700; 
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
.bg-green-600 { background-color: #059669; }
.hover\:bg-green-700:hover { background-color: #047857; }
.text-red-600 { color: #dc3545; }
.hover\:text-red-800:hover { color: #a71d2a; }
.text-red-500 { color: #ef4444; }
.hover\:text-red-700:hover { color: #b91c1c; }
.bg-red-100 { background-color: #fef2f2; }
.text-red-700 { color: #b91c1c; }
.border-red-300 { border-color: #fca5a5; }
.bg-green-100 { background-color: #dcfce7; }
.text-green-700 { color: #15803d; }
.border-green-300 { border-color: #86efac; }
[contenteditable="true"]:focus {
  outline: 2px solid #5C2A72; 
  cursor: text;
  background-color: #f0faff;
  padding: 4px;
  border-radius: 4px;
  display: block; 
}
</style>