<template>
    <div class="min-h-screen pt-14 bg-gray-50">
        
        <div class="relative w-full h-80 overflow-hidden shadow-xl">
            <div 
                class="absolute inset-0 bg-cover bg-center opacity-30" 
                style="background-image: url('/banner2.avif');" 
                alt="Fondo de huella de mascota"
            ></div>
            
            <div class="relative z-10 text-white text-center flex flex-col justify-center h-full container mx-auto px-4">
                <h1 class="text-4xl md:text-6xl font-extrabold mb-3 leading-tight drop-shadow-lg text-bd-gold-accent">
                    Muro de la Memoria
                </h1>
                <p class="text-xl md:text-2xl font-light max-w-3xl mx-auto drop-shadow-md text-gray-200">
                    Un espacio para honrar la vida de los compañeros de cuatro patas que tocaron nuestros corazones.
                </p>
            </div>
        </div>

        <div class="container mx-auto px-4 py-12 -mt-10 relative z-20">
            
            <div class="max-w-3xl mx-auto p-4 md:p-6 rounded-xl border border-dashed border-purple-deep mb-12 flex justify-center bg-white shadow-lg">
                <router-link to="/admin/agregar-mascota">
                    <button 
                        class="bg-purple-deep text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-purple-light transition duration-200 shadow-xl flex items-center justify-center space-x-2"
                    >
                        <font-awesome-icon icon="fas fa-plus-circle" class="text-xl" />
                        <span>Añadir Nuevo Memorial</span>
                    </button>
                </router-link>
            </div>

            <h2 class="text-3xl font-extrabold mb-8 text-dark-primary-blue text-center">
                <font-awesome-icon icon="fas fa-cloud-sun" class="mr-2 text-purple-deep" /> Mensajes en el Cielo
            </h2>

            <div v-if="tributes.length === 0" class="text-center py-10 bg-white-subtle rounded-xl shadow-md">
                <font-awesome-icon icon="fas fa-hand-holding-heart" class="text-6xl text-gray-400 mb-4" />
                <p class="text-xl text-gray-600 font-semibold">Aún no hay mensajes. El administrador debe cargar el primer tributo.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                    v-for="(t, index) in tributes" 
                    :key="index" 
                    class="bg-white p-6 rounded-xl shadow-xl border-l-4 hover:shadow-2xl transition duration-300"
                    :class="index % 3 === 0 ? 'border-purple-deep' : (index % 3 === 1 ? 'border-dark-primary-blue' : 'border-gray-400')"
                >
                    <div class="flex items-center mb-3">
                        <font-awesome-icon icon="fas fa-paw" class="text-xl mr-3" :class="index % 2 === 0 ? 'text-purple-deep' : 'text-dark-primary-blue'" />
                        <span class="text-lg font-bold text-dark-primary-blue">{{ t.author }}</span>
                    </div>
                    
                    <p class="text-gray-700 italic mb-4 h-20 overflow-hidden text-sm leading-relaxed">
                        "{{ t.message }}"
                    </p>
                    
                    <div class="text-right text-xs text-gray-500 border-t pt-2 mt-auto">
                        <font-awesome-icon icon="fas fa-clock" class="mr-1" /> {{ formatTime(t.timestamp) }}
                    </div>
                </div>
                </div>
            
            <div class="text-center mt-12">
                 <button 
                    @click="loadMore"
                    v-if="hasMoreTributes"
                    class="bg-gray-200 text-dark-primary-blue py-2 px-6 rounded-lg font-semibold hover:bg-gray-300 transition duration-150 shadow-md"
                >
                    <font-awesome-icon icon="fas fa-chevron-down" class="mr-2" /> Cargar más tributos
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'; 
import { library } from '@fortawesome/fontawesome-svg-core';
// Se ha cambiado faFeatherAlt por faPlusCircle y se añadió faPaw
import { faPlusCircle, faQuoteLeft, faClock, faCloudSun, faHandHoldingHeart, faChevronDown, faPaw } from '@fortawesome/free-solid-svg-icons';

library.add(faPlusCircle, faQuoteLeft, faClock, faCloudSun, faHandHoldingHeart, faChevronDown, faPaw); 

// --- Tipado ---
interface Tribute {
    author: string;
    message: string;
    timestamp: number;
}

// --- Estado Reactivo (Eliminamos el estado del formulario) ---
const hasMoreTributes = ref(true); // Simulación de paginación

// --- Datos Simulados (Tributos) ---
const tributes: Ref<Tribute[]> = ref([
    { author: 'Max - Familia López', message: 'Gracias por darnos tantos años de amor incondicional, siempre te recordaremos.', timestamp: Date.now() - 86400000 * 2 }, // hace 2 días
    { author: 'Kimi - Catalina y Pancho', message: 'Mi dulce Kimi, te has ido, pero siempre vivirás en cada rincón de nuestra casa. Descansa en paz.', timestamp: Date.now() - 86400000 * 5 }, // hace 5 días
    { author: 'Peluchín - Valentina P.', message: 'Fuiste el mejor perrito que una persona podría pedir. Vuela alto, amigo.', timestamp: Date.now() - 86400000 * 1 }, // hace 1 día
    { author: 'Luna - Los Silva', message: 'Adiós a nuestra gatita. Tu ronroneo y tu calidez nunca serán olvidados. Te extrañaremos.', timestamp: Date.now() - 86400000 * 3 },
    { author: 'Tobby - Benjamín L.', message: 'Mi fiel compañero. Nos diste más de lo que jamás pediste. Gracias por todo.', timestamp: Date.now() - 86400000 * 7 },
]);

// --- Funciones (Eliminamos submitTribute) ---

const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const loadMore = () => {
    console.log('Cargando más tributos (simulación)...');
    hasMoreTributes.value = false;
};

definePageMeta({
    title: 'Muro de la Memoria'
});
</script>

<style scoped>
/* --------------------------------- */
/* PALETA DE COLORES */
/* --------------------------------- */

.bg-purple-dark {
    background-color: #4A235A; 
}
.text-purple-dark {
    color: #4A235A; 
}
.bg-purple-light {
    background-color: #6C3483; 
}
.bg-purple-deep {
    background-color: #5C2A72; 
}
.text-purple-deep {
    color: #5C2A72; 
}
.border-purple-deep {
    border-color: #5C2A72; 
}
.bg-purple-card {
    background-color: #F8F4FA; 
}
.bg-dark-primary-blue { background-color: #34495e; }
.text-dark-primary-blue { color: #34495e; }
.bg-white-subtle { background-color: #F8F4FA; }

/* Dorado de acento para títulos emocionales */
.text-bd-gold-accent { 
    color: #FFD700; 
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Imagen de fondo del héroe */
.hero-background {
    background-image: url('/paw-print.jpg');
}
</style>