<template>
  <div class="flex flex-col items-center py-10 bg-gray-50 min-h-screen">
    
    <div class="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl">
      <h1 class="text-3xl font-bold mb-8 text-center text-primary-dark">Proceso de Reserva</h1>

      <div class="flex justify-between mb-8 border-b-2 border-gray-200">
        <div :class="{'progress-step': true, 'active': step === 1}">1. Mascota y Datos</div>
        <div :class="{'progress-step': true, 'active': step === 2}">2. Pago (Simulado)</div>
        <div :class="{'progress-step': true, 'active': step === 3}">3. Confirmación</div>
      </div>

      <div class="p-6">
        
        <div v-if="step === 1">
          <h2 class="text-2xl font-semibold mb-4 text-accent">Paso 1: Detalles de la Mascota</h2>
          <p class="mb-6 text-gray-600">Servicio: <strong class="text-primary-dark">{{ producto.nombre }}</strong> | Precio: <strong class="text-primary-dark">${{ producto.precio.toLocaleString('es-CL') }} CLP</strong></p>
          
          <form @submit.prevent="nextStep">
            <div class="mb-4">
              <label for="mascota-nombre" class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Mascota:</label>
              <input type="text" v-model="mascota.nombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent">
            </div>
            
            <div class="mb-4">
              <label for="mascota-peso" class="block text-sm font-medium text-gray-700 mb-2">Peso Estimado (kg):</label>
              <input type="number" v-model.number="mascota.peso" required min="0.1" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent">
            </div>

            <div class="mt-8">
              <button type="submit" class="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-150">
                Continuar al Pago
              </button>
            </div>
          </form>
        </div>

        <div v-if="step === 2">
          <h2 class="text-2xl font-semibold mb-6 text-accent">Paso 2: Confirmación y Pago</h2>
          
          <div class="p-4 bg-gray-100 rounded-lg mb-6">
            <p class="text-lg font-medium text-gray-700">Resumen:</p>
            <p>Mascota: <strong>{{ mascota.nombre }}</strong> ({{ mascota.peso }} kg)</p>
            <p>Servicio: <strong>{{ producto.nombre }}</strong></p>
            <p class="text-2xl font-bold mt-2 text-red-600">Total: ${{ producto.precio.toLocaleString('es-CL') }} CLP</p>
          </div>

          <p class="text-lg font-medium mb-3">Selecciona tu Opción de Pago:</p>
          <div class="space-y-3">
            <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" v-model="pago.opcion" value="total" class="form-radio h-5 w-5 text-accent">
              <span class="ml-3 text-gray-800 font-medium">Pago Total (100%)</span>
            </label>
            <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" v-model="pago.opcion" value="abono" class="form-radio h-5 w-5 text-accent">
              <span class="ml-3 text-gray-800 font-medium">Abono (50%): ${{ (producto.precio * 0.5).toLocaleString('es-CL') }} CLP</span>
            </label>
          </div>

          <div class="mt-8">
            <button @click="finalizarReserva" class="w-full bg-success text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-150">
              Finalizar Reserva y Pagar
            </button>
          </div>
        </div>

        <div v-if="step === 3" class="text-center p-8 bg-blue-50 border-2 border-blue-300 rounded-xl">
          <h2 class="text-3xl font-bold mb-4 text-blue-700">Reserva Confirmada ✅</h2>
          <p class="text-xl mb-6 text-gray-700">¡Gracias por tu reserva! El servicio ha sido registrado.</p>
          
          <p class="text-lg font-medium">Tu código de trazabilidad único es:</p>
          <div class="my-4 p-4 bg-white inline-block rounded-lg border-2 border-blue-500 shadow-md">
            <span class="text-4xl font-extrabold tracking-wider text-blue-800" id="codigo-trazabilidad">{{ codigoTrazabilidad }}</span>
          </div>

          <p class="text-sm text-gray-500 mt-2">Guarda este código para hacer seguimiento del estado de tu servicio.</p>
          <NuxtLink to="/" class="mt-6 inline-block bg-primary-dark text-white py-2 px-6 rounded-lg font-medium hover:bg-opacity-90">
            Volver al Catálogo
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- ESTADO DEL FLUJO ---
const step = ref(1);
const producto = ref({ id: '', nombre: 'Cargando...', precio: 0 });
const mascota = ref({ nombre: '', peso: 0 });
const pago = ref({ opcion: 'abono' });
const codigoTrazabilidad = ref('');

// --- Carga Inicial de Datos ---
onMounted(() => {
  const dataString = sessionStorage.getItem('producto_reserva');
  
  if (dataString) {
    try {
      producto.value = JSON.parse(dataString);
      if (producto.value.precio === 0 || !producto.value.id) {
         throw new Error("Datos de producto inválidos.");
      }
    } catch (e) {
      alert("Error al cargar los datos del producto. Volviendo al catálogo.");
      router.push('/');
    }
  } else {
    // Si no hay datos, redirige al catálogo
    router.push('/'); 
  }
});

// --- Lógica del Botón Siguiente (Paso 1 -> Paso 2) ---
const nextStep = () => {
  if (mascota.value.nombre.trim() === '' || mascota.value.peso <= 0) {
    alert("Por favor, completa el nombre y el peso estimado de la mascota.");
    return;
  }
  // Transición a Pago
  step.value = 2; 
};

// --- Lógica de Finalizar Reserva (Paso 2 -> Paso 3) ---
const finalizarReserva = () => {
  // Generar Código de Trazabilidad (Simulado - RF01)
  const codigo = generarCodigoTrazabilidad(10); 
  codigoTrazabilidad.value = codigo;
  
  // Transición a Confirmación
  step.value = 3;
  
  // Limpiar la sesión
  sessionStorage.removeItem('producto_reserva'); 
};

/**
 * RF01: Función para generar el código de trazabilidad único.
 */
function generarCodigoTrazabilidad(longitud: number): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < longitud; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// Configuración de la página (metadatos)
definePageMeta({
  title: 'Flujo de Reserva'
});
</script>

<style scoped>
/* Colores simulados para el diseño profesional */
.text-primary-dark {
    color: #5d4037;
}
.bg-primary-dark {
    background-color: #5d4037;
}
.text-accent, .focus\:ring-accent {
    color: #17a2b8;
    --tw-ring-color: #17a2b8;
}
.bg-accent {
    background-color: #17a2b8;
}
.bg-success {
    background-color: #28a745;
}
.progress-step {
    flex-grow: 1;
    text-align: center;
    padding-bottom: 15px;
    font-weight: 500;
    color: #999;
}
.progress-step.active {
    color: #5d4037; 
    border-bottom: 3px solid #5d4037;
    margin-bottom: -2px; 
}
</style>