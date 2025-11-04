<template>
  <div class="container mx-auto px-4 py-16 font-sans pt-20">
    
    <div class="flex justify-between items-center mb-10 max-w-4xl mx-auto border-b-2 border-gray-300 pb-3">
        <h1 class="text-4xl font-extrabold text-purple-dark">Nuestra Historia y Misión</h1>
        
        <button 
            @click="toggleEditMode" 
            class="text-white transition duration-150 p-3 rounded-full shadow-md" 
            :class="isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-dark hover:bg-purple-light'"
            :title="isEditing ? 'Guardar Cambios' : 'Activar Edición'"
        >
            <font-awesome-icon :icon="isEditing ? 'fas fa-save' : 'fas fa-pencil-alt'" class="text-xl" />
        </button>
    </div>

    <div class="bg-white-subtle p-8 rounded-xl shadow-xl border border-gray-200"
         :class="{'border-2 border-dashed border-purple-deep': isEditing}">
        
        <p 
            class="text-lg text-gray-700 leading-relaxed mb-6"
            :contenteditable="isEditing"
            @blur="handleSaveBlur($event, 'mision')"
            :class="{'bg-white-subtle-edit p-3 rounded-md': isEditing}"
        >
            {{ misionText }}
        </p>

        <h2 class="text-2xl font-bold text-purple-dark mb-4 mt-8">Nuestros Valores Fundamentales</h2>
        
        <ul class="list-disc list-inside space-y-3 text-lg text-gray-700">
            <li v-for="(value, index) in values" :key="index">
                <span 
                    :contenteditable="isEditing"
                    @blur="handleValueUpdate($event, index)"
                    :class="{'border-b border-purple-light': isEditing}"
                >
                    {{ value }}
                </span>
            </li>
        </ul>
        
        <div v-if="isEditing" class="mt-6">
            <button @click="addValue" class="text-purple-dark hover:text-purple-light font-semibold transition duration-150">
                <font-awesome-icon icon="fas fa-plus" class="mr-2" /> Añadir Valor
            </button>
        </div>
        
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faPencilAlt, faSave, faPlus);

const isEditing = ref(false);
const misionText = ref("El Crematorio de Mascotas San Antonio nació de la profunda convicción de que nuestras mascotas merecen una despedida tan digna y respetuosa como cualquier otro miembro de la familia. Nuestra misión es ofrecer servicios funerarios y de cremación con total transparencia y empatía, ayudando a las familias a transitar el duelo con la paz y seguridad de que su compañero de vida será honrado.");
const values = ref([
    "Dignidad: Tratar a cada mascota con el máximo respeto y cuidado.",
    "Transparencia: Garantizar la trazabilidad completa del servicio.",
    "Empatía: Ofrecer apoyo emocional y comprensión a las familias.",
    "Sustentabilidad: Utilizar prácticas y equipos ecológicos en la cremación."
]);

// --- Lógica de Edición ---

const toggleEditMode = () => {
    if (isEditing.value) {
        console.log("Contenido de 'Nosotros' guardado (simulación).");
    }
    isEditing.value = !isEditing.value;
};

const handleSaveBlur = (event: Event, field: string) => {
    const target = event.target as HTMLElement;
    if (field === 'mision') {
        misionText.value = target.innerText.trim();
    }
    // NOTA: No desactivamos la edición al hacer blur, solo guardamos el cambio.
};

const handleValueUpdate = (event: Event, index: number) => {
    const target = event.target as HTMLElement;
    values.value[index] = target.innerText.trim();
};

const addValue = () => {
    values.value.push("Nuevo valor editable");
};


definePageMeta({
    title: 'Nosotros'
});
</script>

<style scoped>
/* CLASES DE COLOR (Para que VS Code las reconozca y se apliquen localmente) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; }
.bg-purple-light { background-color: #6C3483; }
.hover\:bg-purple-light:hover { background-color: #6C3483; }
.text-purple-light { color: #6C3483; }
.border-purple-deep { border-color: #5C2A72; }
.bg-white-subtle { background-color: #F8F4FA; } /* Fondo de tarjeta con tinte púrpura */

/* Estilos para el botón de Guardar/Lápiz */
.bg-green-600 { background-color: #059669; }
.hover\:bg-green-700:hover { background-color: #047857; }

/* Estilos de edición contenteditable */
[contenteditable="true"]:focus {
  outline: 2px solid #5C2A72; /* Borde de foco púrpura profundo */
  cursor: text;
  background-color: #f0faff;
  padding: 4px;
  border-radius: 4px;
  display: block; 
}
</style>