<template>
  <div class="pt-14 py-20 min-h-screen container mx-auto px-4">
    
    <div class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-purple-dark mb-3">Finalizar Reserva</h1>
        <p class="text-lg text-gray-600">Complete los datos de su mascota y el lugar de retiro.</p>
      </div>

      <!-- (NUEVO) Mensaje de Error/Carga -->
      <div v-if="isLoading" class="mb-4 p-4 rounded-lg text-center text-lg bg-blue-100 border border-blue-400 text-blue-700">
        Procesando su reserva...
      </div>
      <div v-if="errorMessage" class="mb-4 p-4 rounded-lg text-center text-sm bg-red-100 border border-red-400 text-red-700">
        {{ errorMessage }}
      </div>

      <!-- Formulario Principal -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna Izquierda: Formularios -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Sección 1: Datos de la Mascota -->
          <div class="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-purple-dark">
            <h2 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2">
              1. Datos de la Mascota
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="petName" class="block text-sm font-semibold text-dark-primary-blue mb-2">Nombre de la Mascota</label>
                <input 
                  v-model="formMascota.petName"
                  id="petName" 
                  type="text" 
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                  placeholder="Nombre de su mascota"
                />
              </div>
              <div>
                <label for="petWeight" class="block text-sm font-semibold text-dark-primary-blue mb-2">Peso (kg)</label>
                <input 
                  v-model.number="formMascota.petWeight"
                  id="petWeight" 
                  type="number" 
                  step="0.1"
                  min="0"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                  placeholder="Ej: 10.5"
                />
              </div>
               <div>
                <label for="petAge" class="block text-sm font-semibold text-dark-primary-blue mb-2">Edad (años)</label>
                <input 
                  v-model.number="formMascota.petAge"
                  id="petAge" 
                  type="number" 
                  min="0"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                  placeholder="Ej: 5"
                />
              </div>
            </div>
          </div>

          <!-- Sección 2: Datos de Retiro/Entrega -->
          <div class="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-purple-dark">
            <h2 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2">
              2. Dirección de Retiro del Servicio
            </h2>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="region" class="block text-sm font-semibold text-dark-primary-blue mb-2">Región</label>
                  <input 
                    v-model="formDireccion.region"
                    id="region" 
                    type="text" 
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                    placeholder="Ej: Biobío"
                  />
                </div>
                <div>
                  <label for="comuna" class="block text-sm font-semibold text-dark-primary-blue mb-2">Comuna</label>
                  <input 
                    v-model="formDireccion.comuna"
                    id="comuna" 
                    type="text" 
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                    placeholder="Ej: Concepción"
                  />
                </div>
              </div>
              <div>
                <label for="direccion" class="block text-sm font-semibold text-dark-primary-blue mb-2">Dirección de Retiro</label>
                <input 
                  v-model="formDireccion.direccion"
                  id="direccion" 
                  type="text" 
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep"
                  placeholder="Calle, Número, Depto (Opcional)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Resumen del Pedido -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-bd-gold-accent sticky top-24">
            <h2 class="text-2xl font-bold text-purple-dark mb-4 border-b pb-2">Resumen</h2>
            
            <!-- (NUEVO) Lista de items en el resumen -->
            <ul class="space-y-2 mb-4">
              <li v-for="item in cart" :key="item.id" class="flex justify-between items-center text-sm">
                <span class="text-gray-700">{{ item.nombre }} <span class="text-gray-500">x{{ item.quantity }}</span></span>
                <span class="font-semibold text-dark-primary-blue">${{ (item.precio * item.quantity).toLocaleString('es-CL') }}</span>
              </li>
            </ul>
            
            <div class="space-y-3 text-lg">
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-semibold text-dark-primary-blue">${{ cartTotal.toLocaleString('es-CL') }}</span>
                </div>
                 <div class="flex justify-between">
                    <span class="text-gray-600">IVA (19%):</span>
                    <span class="font-semibold text-dark-primary-blue">${{ iva.toLocaleString('es-CL') }}</span>
                </div>
                <hr class="border-gray-300">
                <div class="flex justify-between text-2xl font-bold text-purple-dark">
                    <span>Total:</span>
                    <span>${{ totalGeneral.toLocaleString('es-CL') }}</span>
                </div>
            </div>

            <!-- Info de Pago -->
            <div class="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
              <p class="text-sm text-purple-dark font-semibold">
                El pago se gestiona vía Transferencia Bancaria.
              </p>
              <p class="text-xs text-gray-600 mt-1">
                Al confirmar, su reserva quedará "Pendiente" y recibirá un correo con los datos para la transferencia.
              </p>
            </div>

            <button type="submit"
                    :disabled="isLoading || cart.length === 0"
                    class="w-full mt-6 py-3 rounded-xl font-bold text-lg transition duration-300 shadow-lg 
                           bg-purple-deep text-white hover:bg-purple-light hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-deep/50
                           disabled:opacity-50 disabled:cursor-not-allowed">
                <font-awesome-icon icon="fas fa-check-circle" class="mr-2" />
                Confirmar Reserva
            </button>
          </div>
        </div>
        
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faCheckCircle);

// 1. Proteger esta página (solo usuarios logueados)


const router = useRouter();
const user = useUser(); // Estado global del usuario
const { cart, cartTotal, loadCart, clearCart } = useCart(); // Estado global del carrito

// --- Estado de UI ---
const isLoading = ref(false);
const errorMessage = ref('');

// --- Formularios Reactivos ---
// (Separados para que coincida con la lógica de la API de checkout)
const formMascota = ref({
  petName: '',
  petWeight: null as number | null,
  petAge: null as number | null,
});

const formDireccion = ref({
  region: '',
  comuna: '',
  direccion: '',
});

// 2. Rellenar el formulario de dirección con los datos del usuario
onMounted(() => {
  loadCart(); // Cargar el carrito desde sessionStorage
  
  if (user.value) {
    formDireccion.value = {
      region: user.value.region || '',
      comuna: user.value.comuna || '',
      direccion: user.value.direccion || '',
    };
  }
});

// --- Totales ---
// (La API de checkout calcula el IVA, pero lo mostramos aquí también)
const iva = computed(() => Math.round(cartTotal.value * 0.19));
const totalGeneral = computed(() => cartTotal.value + iva.value);


// --- (ACTUALIZADO) Función de Envío (Checkout) ---
const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  // 1. Validaciones
  if (!user.value || !user.value.id_usuario) {
    errorMessage.value = "Error de sesión. Por favor, inicie sesión de nuevo.";
    isLoading.value = false;
    return;
  }
  if (cart.value.length === 0) {
    errorMessage.value = "Tu carrito está vacío.";
    isLoading.value = false;
    router.push('/'); // Si está vacío, lo mandamos al inicio
    return;
  }
  if (!formMascota.value.petName || !formMascota.value.petWeight) {
    errorMessage.value = "Por favor, complete el nombre y peso de la mascota.";
    isLoading.value = false;
    return;
  }
  if (!formDireccion.value.region || !formDireccion.value.comuna || !formDireccion.value.direccion) {
    errorMessage.value = "Por favor, complete los datos de dirección de retiro.";
    isLoading.value = false;
    return;
  }

  // 2. (CORREGIDO) Construir el body que la API (checkout.post.ts) espera
  const bodyPayload = {
    formData: {
      petName: formMascota.value.petName,
      petWeight: formMascota.value.petWeight || 0,
      petAge: formMascota.value.petAge || 0,
      region: formDireccion.value.region,
      comuna: formDireccion.value.comuna,
      direccion: formDireccion.value.direccion,
      metodoPago: 'Transferencia Bancaria' // Hardcodeado, como espera la API
    },
    cartItems: cart.value,
    cartTotal: cartTotal.value, // Subtotal (la API calculará el IVA)
    userId: user.value.id_usuario
  };

  try {
    // 3. Llamar a la API de Checkout
    const response = await $fetch('/api/checkout', {
      method: 'POST',
      body: bodyPayload
    });

    // 4. Éxito
    isLoading.value = false;
    clearCart(); // Limpiar el carrito

    // 5. Redirigir a la página de tracking con el nuevo código
    alert('¡Reserva creada con éxito! Serás redirigido a la página de seguimiento.');
    // (Usamos 'response.trackingCode' que es lo que devuelve la API)
    router.push(`/tracking?codigo=${response.trackingCode}`);

  } catch (error: any) {
    // 6. Error
    isLoading.value = false;
    console.error('Error en el checkout:', error);
    errorMessage.value = error.data?.statusMessage || 'Error desconocido. No se pudo crear la reserva.';
  }
};

</script>

<style scoped>
/* Estilos (Copiados de carrito.vue) */
.text-purple-dark { color: #4A235A; }
.bg-purple-dark { background-color: #4A235A; } 
.bg-purple-light { background-color: #6C3483; }
.border-purple-light { border-color: #6C3483; }
.bg-purple-deep { background-color: #5C2A72; } 
.text-purple-deep { color: #5C2A72; } 
.text-dark-primary-blue { color: #34495e; }
.border-bd-gold-accent { border-color: #FFD700; }
.focus\:ring-purple-deep\/50:focus { --tw-ring-color: rgba(92, 42, 114, 0.5); }
.text-red-600 { color: #dc3545; }
.hover\:text-red-800:hover { color: #a71d2a; }
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
.bg-red-100 { background-color: #fef2f2; }
.border-red-400 { border-color: #fca5a5; }
.text-red-700 { color: #b91c1c; }
.bg-blue-100 { background-color: #eff6ff; }
.border-blue-400 { border-color: #93c5fd; }
.text-blue-700 { color: #1d4ed8; }
.bg-purple-50 { background-color: #f3e5f5; }
.border-purple-200 { border-color: #ce93d8; }
.focus\:border-purple-deep:focus { border-color: #5C2A72; }
.focus\:ring-purple-deep:focus { --tw-ring-color: #5C2A72; }
</style>