<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl pt-20">
    
    <button @click="router.back()" class="text-purple-light hover:text-purple-dark transition duration-150 mb-6 flex items-center">
      <font-awesome-icon icon="fas fa-arrow-left" class="mr-2" /> Volver al Catálogo
    </button>

    <div v-if="!producto.id" class="text-center p-10 bg-white-subtle shadow-lg rounded-lg border border-purple-light">
      <h1 class="text-3xl font-bold text-red-600">Producto No Encontrado</h1>
      <p class="mt-4 text-gray-600">Por favor, regrese al catálogo y seleccione un producto.</p>
    </div>

    <div v-else class="bg-white-subtle p-8 rounded-lg shadow-xl border-b-4 border-purple-deep">
      
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h1 class="text-3xl font-bold text-purple-dark">{{ producto.nombre }}</h1>
        <button 
          @click="startEditing" 
          v-if="!isEditing"
          class="bg-purple-deep text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-light transition duration-150 shadow-md"
        >
          <font-awesome-icon icon="fas fa-edit" class="mr-2" /> Editar Producto
        </button>
      </div>

      <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg overflow-hidden">
             <img :src="producto.imagenUrl || '/placeholder/producto_lg.jpg'" :alt="producto.nombre" class="w-full h-full object-cover">
        </div>

        <div class="space-y-4">
          <p class="text-2xl font-bold text-gray-800">
            Precio: ${{ producto.precio.toLocaleString('es-CL') }} CLP
          </p>
          
          <p class="text-lg font-semibold text-purple-deep">
            Categoría: <span class="font-normal text-gray-700">{{ producto.tipo }}</span>
          </p>

          <p class="text-gray-600 leading-relaxed pt-2">
            <span class="font-semibold text-purple-dark block mb-1">Descripción:</span>
            {{ producto.descripcion }}
          </p>
          
          <p v-if="producto.requierePersonalizacion" class="text-sm text-green-600 flex items-center">
            <font-awesome-icon icon="fas fa-check-circle" class="mr-2" /> Este ítem requiere personalización.
          </p>
          <p v-else class="text-sm text-gray-500 flex items-center">
            <font-awesome-icon icon="fas fa-times-circle" class="mr-2" /> No requiere personalización.
          </p>

          <button 
            @click="iniciarReserva(producto)"
            class="mt-6 w-full bg-purple-deep text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-light transition duration-150 shadow-md"
          >
            Añadir al Pedido
          </button>
        </div>
      </div>

      <div v-else class="space-y-6 p-4 border border-purple-light rounded-lg bg-white">
        <h2 class="text-2xl font-bold text-purple-dark border-b pb-2">Editando: {{ producto.nombre }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="block text-sm font-semibold text-dark-primary-blue mb-1">Nombre del Producto</label>
            <input type="text" v-model="form.nombre" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-deep focus:border-purple-deep transition" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-dark-primary-blue mb-1">Precio (CLP)</label>
            <input type="number" v-model.number="form.precio" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-deep focus:border-purple-deep transition" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-dark-primary-blue mb-1">Categoría</label>
            <select v-model="form.tipo" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-deep focus:border-purple-deep transition bg-white">
              <option value="Servicio">Servicio de Cremación</option>
              <option value="Urna">Urna</option>
              <option value="Accesorio">Accesorio</option>
              <option value="Servicio Extra">Servicio Extra</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-dark-primary-blue mb-1">¿Requiere Personalización?</label>
            <select v-model="form.requierePersonalizacion" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-deep focus:border-purple-deep transition bg-white">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-dark-primary-blue mb-1">Descripción</label>
            <textarea v-model="form.descripcion" rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-deep focus:border-purple-deep transition"></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 pt-4">
          <button @click="cancelEditing" class="py-2 px-5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button @click="saveChanges" class="bg-purple-deep text-white py-2 px-5 rounded-lg font-semibold hover:bg-purple-light transition shadow-md">
            <font-awesome-icon icon="fas fa-save" class="mr-2" /> Guardar Cambios
          </button>
        </div>

      </div>

    </div>

    <section class="mt-12">
        <h2 class="text-3xl font-bold text-purple-dark mb-6 border-b pb-2">Opiniones de Clientes</h2>
        
        <div class="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-100">
            <h3 class="text-xl font-semibold text-purple-dark mb-4">Deja tu Opinión</h3>
            
            <form @submit.prevent="submitReview" class="space-y-4">
                
                <div>
                    <label class="block text-sm font-medium text-dark-primary-blue mb-2">Tu Calificación:</label>
                    <div class="flex items-center space-x-1 text-2xl text-yellow-500 cursor-pointer">
                        <font-awesome-icon 
                            v-for="star in 5" 
                            :key="star" 
                            :icon="star <= reviewForm.rating ? 'fas fa-star' : 'far fa-star'" 
                            @click="reviewForm.rating = star"
                            class="transition duration-150"
                        />
                        <span class="ml-3 text-base text-gray-500">{{ reviewForm.rating }} / 5</span>
                    </div>
                </div>
                
                <div>
                    <label for="reviewComment" class="block text-sm font-medium text-dark-primary-blue mb-1">Tu Comentario:</label>
                    <textarea id="reviewComment" v-model="reviewForm.comment" rows="4" required
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-deep focus:border-purple-deep transition"
                            placeholder="Comparte tu experiencia con este producto..."></textarea>
                </div>

                <button type="submit" class="bg-purple-deep text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-light transition duration-150 shadow-md">
                    Enviar Reseña
                </button>
            </form>
        </div>

        <div class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-deep">
                
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center space-x-1 text-lg text-yellow-500">
                        <font-awesome-icon v-for="star in 5" :key="star" :icon="star <= review.rating ? 'fas fa-star' : 'far fa-star'" />
                    </div>
                    <span class="text-sm text-gray-500">{{ review.date }}</span>
                </div>

                <p class="font-semibold text-gray-800 mb-1">{{ review.author }}</p>
                <p class="text-gray-700 text-sm">{{ review.comment }}</p>
                
            </div>
        </div>
        
        <p v-if="!reviews.length" class="text-gray-500 text-center py-6">Sé el primero en dejar una opinión sobre este producto.</p>
        
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
// Importación de iconos sólida (fasStar) y de contorno (farStar)
import { faArrowLeft, faEdit, faSave, faCheckCircle, faTimesCircle, faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

// Añade todos los iconos a la librería
library.add(faArrowLeft, faEdit, faSave, faCheckCircle, faTimesCircle, fasStar, farStar);


const router = useRouter();

// Define la estructura para el producto (lo que se muestra)
const producto = ref<any>({});
// Define el estado del formulario (lo que se edita)
const form = ref<any>({});
const isEditing = ref(false);

// --- Lógica de Reseñas ---

interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

const reviewForm = ref({
    rating: 0,
    comment: '',
});

const reviews = ref<Review[]>([
    { id: 1, author: 'Carlos R.', rating: 5, comment: 'Hermosa urna, muy digna y con un acabado perfecto. El servicio fue muy respetuoso.', date: '2025-10-15' },
    { id: 2, author: 'Laura G.', rating: 4, comment: 'Cumplió con mis expectativas. El proceso fue sencillo, aunque la entrega tardó un día más de lo esperado.', date: '2025-09-28' },
]);

const submitReview = () => {
    if (reviewForm.value.rating === 0) {
        alert('Por favor, selecciona una calificación con estrellas.');
        return;
    }
    
    const newDate: string = new Date().toISOString().split('T')[0] || ''; 
    
    const newReview: Review = {
        id: Date.now(),
        author: 'Nuevo Usuario',
        rating: reviewForm.value.rating,
        comment: reviewForm.value.comment.trim(),
        date: newDate,
    };
    
    reviews.value.unshift(newReview);
    
    reviewForm.value.rating = 0;
    reviewForm.value.comment = '';
    alert('¡Gracias! Tu reseña ha sido enviada (simulación).');
};


// --- Lógica de Edición y Carga ---

onMounted(() => {
    const savedProduct = sessionStorage.getItem('detalle_producto');
    if (savedProduct) {
        const productData = JSON.parse(savedProduct);
        producto.value = productData;
        form.value = { ...productData };
    } else {
        // Datos por defecto si no se encontró producto
        producto.value = { id: 999, nombre: 'Urna Memorial Clásica', tipo: 'Urna', precio: 150000, descripcion: 'Esta es la descripción por defecto del producto.', requierePersonalizacion: true, imagenUrl: '/placeholder/default.jpg' };
        form.value = { ...producto.value };
    }
});

const startEditing = () => {
    isEditing.value = true;
    form.value = { ...producto.value };
};

const cancelEditing = () => {
    isEditing.value = false;
    form.value = { ...producto.value };
};

const saveChanges = () => {
    console.log('Simulación: Guardando cambios...', form.value);
    producto.value = { ...form.value };
    sessionStorage.setItem('detalle_producto', JSON.stringify(producto.value));
    isEditing.value = false;
    // alert(`SIMULACIÓN: Los cambios para "${producto.value.nombre}" han sido guardados.`);
};


// --- Otras Funciones ---

const iniciarReserva = (producto: any) => {
    sessionStorage.setItem('producto_reserva', JSON.stringify(producto));
    router.push('/carrito'); 
};


definePageMeta({
    title: 'Detalle del Producto'
});
</script>

<style scoped>
/* CLASES DE COLOR (Para consistencia visual) */
.text-purple-dark { color: #4A235A; } 
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.bg-purple-deep { background-color: #5C2A72; } 
.border-purple-deep { border-color: #5C2A72; } 
.text-purple-deep { color: #5C2A72; } 
.bg-white-subtle { background-color: #F8F4FA; } /* Fondo de tarjeta claro con tinte púrpura */

/* Gris Carbón para texto general/etiquetas */
.text-dark-primary-blue { color: #34495e; } 
.border-dark-primary-blue { border-color: #34495e; }


/* Estilos de FOCO en inputs (Púrpura) */
.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }
.focus\:border-purple-deep:focus { border-color: #5C2A72; }

/* Estilos de botones de terceros (Green) */
.bg-green-600 { background-color: #059669; }
.hover\:bg-green-700:hover { background-color: #047857; }

/* Estilos de estrellas */
.text-yellow-500 { color: #F59E0B; }
</style>