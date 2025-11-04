<template>
  <div class="container mx-auto px-4 py-16 font-sans pt-20">
    
    <div class="flex justify-between items-center mb-10 max-w-5xl mx-auto border-b-2 border-gray-300 pb-3">
        <h1 class="text-4xl font-extrabold text-purple-dark">Muro del Recuerdo</h1>
        
        <button 
            @click="router.push('/admin/agregar-mascota')" 
            class="bg-purple-dark text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md"
        >
            <font-awesome-icon icon="fas fa-plus" class="mr-2" /> Añadir Memorial
        </button>
    </div>

    <div v-if="memorials.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        <div v-for="mem in memorials" :key="mem.id" class="bg-white-subtle p-4 rounded-xl shadow-lg border-t-4 border-purple-deep">
            
            <div class="h-40 bg-gray-300 rounded-md mb-3 overflow-hidden relative">
                 <img :src="mem.imageUrl || '/placeholder/memorial.jpg'" :alt="mem.nombre" class="w-full h-full object-cover">

                 <NuxtLink 
                    :to="{ path: '/admin/editar-memorial', query: { id: mem.id } }"
                    @click.stop 
                    class="absolute top-2 right-2 bg-purple-deep text-white p-2 rounded-full cursor-pointer hover:bg-purple-light transition duration-150"
                    title="Editar Memorial">
                    <font-awesome-icon icon="fas fa-ellipsis-v" class="text-base" />
                 </NuxtLink>

            </div>

            <h3 class="text-xl font-bold text-purple-dark">{{ mem.nombre }}</h3>
            <p class="text-sm text-gray-600">Compañero de {{ mem.owner }}</p>
            <p class="text-xs text-gray-500 mt-2">En el corazón: {{ mem.date }}</p>

            <NuxtLink 
              :to="{ path: '/admin/editar-memorial', query: { id: mem.id } }"
              class="mt-4 text-purple-deep hover:text-purple-light text-sm font-semibold block"
            >
                Ver/Editar Dedicatoria →
            </NuxtLink>
        </div>
    </div>
    <div v-else class="text-center py-10 bg-white-subtle rounded-xl shadow-lg">
        <p class="text-xl text-gray-600">Aún no hay recuerdos para mostrar. ¡Sé el primero en añadir uno!</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons'; 

library.add(faEllipsisV, faPlus);

const router = useRouter();

interface MascotaHonrada {
    id: number;
    nombre: string;
    owner: string;
    imageUrl?: string;
    date: string;
}

// Datos simulados
const memorials = ref<MascotaHonrada[]>([
    { id: 1, nombre: 'Max', owner: 'Familia García', date: '2025-10-25', imageUrl: '/placeholder/memorial1.jpg' },
    { id: 2, nombre: 'Luna', owner: 'Javier S.', date: '2025-09-15', imageUrl: '/placeholder/memorial2.jpg' },
    { id: 3, nombre: 'Toby', owner: 'Ana P.', date: '2025-10-01', imageUrl: '/placeholder/memorial3.jpg' },
    { id: 4, nombre: 'Rocky', owner: 'María L.', date: '2025-08-10', imageUrl: '/placeholder/memorial4.jpg' },
]);

definePageMeta({
    title: 'Muro del Recuerdo',
});
</script>

<style scoped>
/* CLASES DE COLOR (Para consistencia visual) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; }
.bg-purple-light { background-color: #6C3483; }
.hover\:bg-purple-light:hover { background-color: #6C3483; }
.text-purple-deep { color: #5C2A72; }
.bg-purple-deep { background-color: #5C2A72; }
.border-purple-deep { border-color: #5C2A72; } 
.bg-white-subtle { background-color: #F8F4FA; } 
</style>