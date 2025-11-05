<template>
  <div class="container mx-auto px-4 py-16 font-sans pt-20">
    
    <div class="flex justify-center items-center mb-6 max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-extrabold text-purple-dark">Nuestras Instalaciones</h1>
    </div>
    
    <p 
      class="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto"
      title="Texto introductorio"
    >
      {{ initialIntroText }}
    </p>

    <div v-for="(section, index) in sections" :key="section.id" class="relative">
      <div class="bg-white shadow-xl rounded-lg overflow-hidden mb-8 border border-gray-200"
           :class="{'border-2 border-dashed border-purple-deep': section.isEditing}">
        <div class="p-8 md:p-12">
          
          <div class="flex justify-between items-start mb-4 border-b pb-2">
            <h2 
              class="text-3xl font-bold text-purple-dark flex-grow"
              :contenteditable="section.isEditing"
              @blur="handleContentUpdate($event, index, 'title')"
              @keydown.enter.prevent="saveCard(index)" 
              :class="{'border-b-2 border-purple-light': section.isEditing}"
              title="Título de la sección"
            >
              {{ section.title }}
            </h2>
            
            <div class="flex items-center space-x-2 ml-4">
                <button 
                    @click="section.isEditing ? saveCard(index) : editCard(index)"
                    class="text-white transition duration-150 p-2 rounded-full shadow-md"
                    :class="section.isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-dark hover:bg-purple-light'"
                    :title="section.isEditing ? 'Guardar Cambios' : 'Editar Tarjeta'">
                    <font-awesome-icon :icon="section.isEditing ? 'fas fa-save' : 'fas fa-pencil-alt'" class="text-xl" />
                </button>

                <button v-if="!section.isEditing" @click="removeSection(index)"
                  class="text-red-600 hover:text-red-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
                  title="Eliminar esta sección">
                  <font-awesome-icon icon="fas fa-trash" class="text-xl" />
                </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div :class="{'order-last md:order-first': index % 2 !== 0}"> 
              <p 
                class="text-gray-700 mb-4"
                :contenteditable="section.isEditing"
                @blur="handleContentUpdate($event, index, 'body')"
                @keydown.enter.prevent="saveCard(index)"
                :class="{'border-2 border-dashed border-purple-deep p-2 bg-white': section.isEditing}"
                title="Párrafo"
              >
                {{ section.body }}
              </p>
              
              <ul class="list-disc list-inside text-gray-600 space-y-2">
                <li v-for="(item, i) in section.features" :key="i"
                  class="flex items-center"
                >
                  <span 
                    :contenteditable="section.isEditing" 
                    @blur="handleFeatureUpdate($event, index, i)"
                    @keydown.enter.prevent="saveCard(index)"
                    :class="{'border-b border-purple-light': section.isEditing}"
                    class="flex-grow"
                  >
                    {{ item }}
                  </span>
                  <button v-if="section.isEditing" @click="removeFeature(index, i)"
                    class="text-red-500 hover:text-red-700 ml-2" title="Eliminar característica">
                    <font-awesome-icon icon="fas fa-times" class="text-sm" />
                  </button>
                </li>
                <li v-if="section.isEditing">
                  <button @click="addFeature(index)"
                    class="text-purple-dark hover:text-purple-light transition duration-150 text-sm font-medium mt-2">
                    <font-awesome-icon icon="fas fa-plus" class="mr-1" /> Añadir Característica
                  </button>
                </li>
              </ul>
            </div>

            <div class="h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium border border-gray-400">
                <div v-if="section.isEditing" class="h-full w-full flex flex-col justify-center items-center cursor-pointer hover:bg-gray-300 transition duration-150" title="Haga clic para subir imagen">
                    <font-awesome-icon icon="fas fa-plus-circle" class="text-5xl text-purple-dark mb-2" />
                    <h2 class="text-lg font-semibold text-gray-600 mt-2 text-center">Agregar Ítem</h2>
                </div>
                <span v-else>
                    
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-8 mb-8">
        <button
            @click="addSection"
            title="Añadir nueva sección de instalaciones"
            class="bg-purple-dark text-white p-4 rounded-full shadow-xl hover:bg-purple-light transition duration-300 transform hover:scale-105 inline-flex items-center justify-center">
            
            <font-awesome-icon icon="fas fa-plus" class="text-3xl" />
        </button>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt, faSave, faPlus } from '@fortawesome/free-solid-svg-icons'; 

library.add(faPencilAlt, faSave, faPlus);

definePageMeta({
  title: 'Instalaciones'
});

interface InstallationSection {
    id: number;
    title: string;
    body: string;
    features: string[];
    isEditing: boolean; // Estado de edición individual
}

const initialIntroText = ref('Diseñadas para ofrecer un ambiente de paz y respeto, nuestras instalaciones proporcionan la comodidad y privacidad necesarias para despedir a su compañero de vida.');

const initialSections: Ref<InstallationSection[]> = ref([
    { 
        id: 1, title: 'Salas de Despedida', 
        body: 'Contamos con salas privadas y confortables para que las familias puedan realizar ceremonias de despedida íntimas. Cada sala está equipada con asientos cómodos y una atmósfera tranquila. Ofrecemos la posibilidad de personalizar el espacio con fotografías y recuerdos de su mascota.',
        features: ['Espacios privados y climatizados.', 'Capacidad para familiares cercanos.', 'Área de descanso y refrigerios.'],
        isEditing: false,
    },
    { 
        id: 2, title: 'Unidad de Cremación', 
        body: 'Nuestro crematorio utiliza equipos modernos que garantizan la trazabilidad y el respeto en todo el proceso. Si elige la cremación individual, puede estar seguro de que recibirá únicamente las cenizas de su mascota, con total transparencia y dignidad.',
        features: ['Tecnología certificada y ecológica.', 'Máximo estándar de higiene y seguridad.', 'Zona de espera para el inicio del servicio.'],
        isEditing: false,
    },
]);

const sections = ref(initialSections.value);

// --- Funciones de Edición de Tarjetas ---

const editCard = (index: number) => {
    if (!sections.value?.[index]) return; 

    sections.value.forEach((s, i) => {
        if (i !== index && s.isEditing) {
            saveCard(i); 
        }
    });
    sections.value[index].isEditing = true;
};

const saveCard = (index: number) => {
    if (!sections.value?.[index] || !sections.value[index].isEditing) return;

    console.log(`Simulación: Cambios en la Tarjeta ${sections.value[index].title} guardados localmente.`);
    
    sections.value[index].isEditing = false;
};

// --- Lógica para Añadir/Eliminar Secciones Completas ---
const addSection = () => {
    sections.value.forEach((s, i) => {
        if (s.isEditing) saveCard(i);
    });

    const newId = sections.value.length > 0 ? Math.max(...sections.value.map(s => s.id)) + 1 : 1;
    sections.value.push({
        id: newId,
        title: 'Nueva Sección de Instalación',
        body: 'Describe aquí esta nueva área o servicio. Haz clic en el lápiz para editar.',
        features: ['Nueva Característica'],
        isEditing: true, 
    });
};

const removeSection = (index: number) => {
    if (!sections.value?.[index]) return; 
    if (confirm('ADVERTENCIA: ¿Estás seguro de eliminar permanentemente esta sección?')) {
        sections.value.splice(index, 1);
        console.log('Simulación: Sección eliminada.');
    }
};

// --- Lógica para Añadir/Eliminar Características (Features) ---
const addFeature = (sectionIndex: number) => {
    if (!sections.value?.[sectionIndex]) return; 
    sections.value[sectionIndex].features.push('Nueva Característica Editable');
};

const removeFeature = (sectionIndex: number, featureIndex: number) => {
    if (!sections.value?.[sectionIndex] || sections.value[sectionIndex]?.features[featureIndex] === undefined) return; 
    sections.value[sectionIndex].features.splice(featureIndex, 1);
};

// --- Manejo de Actualizaciones de Contenido (en el evento blur) ---

const handleContentUpdate = (event: Event, index: number, field: 'title' | 'body') => {
    const target = event.target as HTMLElement;
    const newContent = target.innerText.trim();
    
    if (!sections.value?.[index]) return; 

    if (!newContent) {
        console.error(`El campo ${field} no puede estar vacío. Revirtiendo cambio.`);
        target.innerText = sections.value[index][field]; 
        return;
    }

    sections.value[index][field] = newContent;
    console.log(`Guardado en línea (Local): Sección ${index} - ${field} actualizado.`);
};

const handleFeatureUpdate = (event: Event, sectionIndex: number, featureIndex: number) => {
    const target = event.target as HTMLElement;
    const newContent = target.innerText.trim();
    
    const section = sections.value?.[sectionIndex];
    if (!section || section.features?.[featureIndex] === undefined) return;
    
    if (!newContent) {
        removeFeature(sectionIndex, featureIndex);
        return;
    }

    section.features[featureIndex] = newContent;
    console.log(`Guardado en línea (Local): Feature ${sectionIndex}.${featureIndex} actualizado.`);
};
</script>

<style scoped>
/* 1. PALETA DE MORADOS Y PÚRPURAS */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; }
.bg-purple-light { background-color: #6C3483; }
.text-purple-light { color: #6C3483; }
.hover\:bg-purple-light:hover { background-color: #6C3483; }

/* Tono más profundo para acentos como el borde de la tarjeta */
.bg-purple-deep {
    background-color: #5C2A72; 
}
.border-purple-deep {
    border-color: #5C2A72; /* Borde de acento de tarjeta */
}

/* 2. ESTILOS DE TERCEROS (Para el botón de Guardar/Error) */
.bg-green-600 { background-color: #059669; }
.hover\:bg-green-700:hover { background-color: #047857; }


/* Estilos de edición contenteditable */
[contenteditable="true"]:focus {
  outline: 2px solid #5C2A72; /* Borde de foco púrpura profundo */
  cursor: text;
  background-color: #f0faff; /* Fondo de edición muy claro */
  padding: 4px;
  border-radius: 4px;
  display: block; 
}
</style>