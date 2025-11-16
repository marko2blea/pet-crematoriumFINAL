<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    <form @submit.prevent="crearProducto" class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-purple-dark">
        
        <div class="p-6 bg-gray-50 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-purple-dark">Añadir Nuevo Producto</h1>
            <p class="text-lg text-gray-600 mt-1">Completa los detalles del nuevo ítem.</p>
        </div>

        <div v-if="message" 
             :class="isError ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'"
             class="m-6 p-4 rounded-lg border text-sm font-medium text-center">
            {{ message }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            
            <div class="p-6 md:p-8 space-y-4">
                <label class="block text-xl font-semibold text-purple-deep mb-2">Imagen del Producto</label>
                <input 
                    type="file" 
                    @change="onFileSelected"
                    accept="image/png, image/jpeg, image/webp"
                    class="w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-purple-100 file:text-purple-deep
                           hover:file:bg-purple-200 cursor-pointer"
                />
                <div v-if="previewUrl" class="mt-4">
                    <img :src="previewUrl" alt="Vista previa" class="w-full h-64 object-cover rounded-lg shadow-md">
                </div>
                <div v-else class="mt-4 w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <p class="text-gray-400">Vista previa de la imagen</p>
                </div>
            </div>

            <div class="p-6 md:p-8 space-y-6">
                <div>
                    <label for="nombre" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre del Producto</label>
                    <input v-model="form.nombre" type="text" id="nombre" class="form-input" required />
                </div>
                <div>
                    <label for="tipo" class="block text-sm font-semibold text-dark-primary-blue mb-2">Tipo de Producto</label>
                    <select v-model="form.tipo" id="tipo" class="form-input bg-white">
                        <option value="Servicio">Servicio</option>
                        <option value="Urna">Urna</option>
                        <option value="Accesorio">Accesorio</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                
                <div>
                    <label for="descripcion" class="block text-sm font-semibold text-dark-primary-blue mb-2">Descripción</label>
                    <textarea v-model="form.descripcion" id="descripcion" rows="3" class="form-input" placeholder="Describe el producto..."></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label for="stock" class="block text-sm font-semibold text-dark-primary-blue mb-2">Stock Inicial</label>
                        <input v-model.number="form.stock" type="number" id="stock" class="form-input" required />
                    </div>
                    <div>
                        <label for="precio" class="block text-sm font-semibold text-dark-primary-blue mb-2">Precio (CLP)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input v-model.number="form.precio" type="number" id="precio" class="form-input pl-7" required />
                        </div>
                    </div>
                </div>

                <div>
                    <label for="disponible" class="block text-sm font-semibold text-dark-primary-blue mb-2">Disponibilidad</label>
                    <select v-model="form.disponible" id="disponible" class="form-input bg-white">
                        <option :value="true">Disponible</option>
                        <option :value="false">Agotado / No Disponible</option>
                    </select>
                </div>

                <div>
                    <label for="proveedor" class="block text-sm font-semibold text-dark-primary-blue mb-2">Proveedor (Opcional)</label>
                    <select v-model.number="form.id_proveedor" id="proveedor" class="form-input bg-white">
                        <option :value="null">-- Sin Proveedor --</option>
                        <option value="2">Urnas del Sur</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" @click="router.push('/admin/inventario')" 
                    class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150">
                Cancelar
            </button>
            <button type="submit" 
                    :disabled="isLoading"
                    class="px-5 py-2 bg-purple-deep text-white rounded-lg hover:bg-purple-light transition duration-150 shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isLoading ? 'Creando...' : 'Crear Producto' }}
            </button>
        </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth'
});

const router = useRouter();
const { upload } = useCloudinaryUpload(); 

const form = ref({
    nombre: '',
    tipo: 'Urna',
    descripcion: '', 
    stock: 1,
    precio: 10000,
    disponible: true,
    id_proveedor: null as number | null,
    // (Omitimos imagen_url aquí, se añade en el $fetch)
});

const selectedFile = ref<File | null>(null); 
const previewUrl = ref<string | null>(null); 
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

const onFileSelected = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            previewUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(selectedFile.value);
    } else {
        selectedFile.value = null;
        previewUrl.value = null;
    }
};

const crearProducto = async () => {
    isLoading.value = true;
    message.value = '';
    isError.value = false;
    let imageUrl: string | null = null; 

    try {
        if (selectedFile.value) {
            message.value = 'Subiendo imagen...';
            imageUrl = await upload(selectedFile.value);
            if (!imageUrl) {
                throw new Error('Error al subir la imagen a Cloudinary.');
            }
        }
        message.value = 'Guardando datos del producto...';
        await $fetch('/api/admin/agregar-producto', {
            method: 'POST',
            body: {
                ...form.value,
                imagen_url: imageUrl // Añadimos la URL aquí
            }
        });
        message.value = '¡Producto creado con éxito! Redirigiendo...';
        setTimeout(() => {
            router.push('/admin/inventario');
        }, 2000);
    } catch (err: any) {
        isLoading.value = false;
        isError.value = true;
        message.value = err.data?.statusMessage || err.message || 'Error al crear el producto.';
    }
};
</script>

<style scoped lang="postcss">
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.text-purple-deep { color: #5C2A72; } 
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }
.text-dark-primary-blue { color: #34495e; }
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
.bg-green-100 { background-color: #d4edda; } 
.text-green-700 { color: #155724; } 
.border-green-300 { border-color: #c3e6cb; }
.bg-red-100 { background-color: #f8d7da; }
.text-red-700 { color: #721c24; }
.border-red-300 { border-color: #f5c6cb; }
.bg-purple-100 { background-color: #f3e5f5; }
.hover\:bg-purple-200:hover { background-color: #e1bee7; }

/* (CORREGIDO) Añadidas las definiciones de 'ring' y 'border' */
.focus\:ring-purple-deep:focus { 
    --tw-ring-color: #5C2A72; 
}
.focus\:border-purple-deep:focus { 
    border-color: #5C2A72; 
}

/* Clase reutilizable para inputs */
.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-deep focus:border-purple-deep;
}
</style>