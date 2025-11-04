<template>
  <div class="container mx-auto px-4 py-8">
    
    <div class="shadow-lg p-6 rounded-lg bg-white mb-8 border-t-4 border-cyan-700">
        
        <h1 class="text-3xl font-bold mb-2 text-center text-dark-primary-blue font-sans">Dignidad y Respeto para su Compañero de Vida</h1>
        <p class="text-center text-gray-600 mb-0 font-sans">Sabemos que su mascota es familia. Elija el servicio y productos que mejor honren su amor y su memoria.</p>
    </div>

    <div class="mb-10 flex flex-col md:flex-row gap-4 items-center p-4 rounded-lg border border-gray-300">
        
        <div class="relative w-full md:w-1/4">
            <input 
                type="text" 
                v-model="busquedaTexto" 
                placeholder="Buscar por Urna, Servicio o palabra clave..."
                class="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-700 focus:outline-none transition duration-150"
                @keyup.enter="ejecutarBusquedaCompleta"
            />
            <font-awesome-icon icon="fas fa-search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>


        <select 
            v-model="filtroTipo"
            class="w-full md:w-1/4 p-3 border-2 border-gray-300 rounded-lg focus:border-cyan-700 focus:outline-none bg-white transition duration-150"
        >
            <option value="todos" disabled>Categoría</option>
            <option value="Servicio">Solo Servicios de Cremación</option>
            <option value="Urna">Solo Urnas</option>
            <option value="Accesorio">Solo Accesorios</option>
        </select>

        <select 
            v-model="filtroPrecio"
            class="w-full md:w-1/4 p-3 border-2 border-gray-300 rounded-lg focus:border-cyan-700 focus:outline-none bg-white transition duration-150"
        >
            <option value="todos" disabled>Precio</option>
            <option value="bajo">Menos de $50.000</option>
            <option value="medio">$50.000 - $100.000</option>
            <option value="alto">Más de $100.000</option>
        </select>
        
        <button 
            @click="ejecutarBusquedaCompleta" 
            type="button"
            class="w-full md:w-1/4 bg-dark-primary-blue text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-150 shadow-md flex items-center justify-center space-x-2"
        >
            <font-awesome-icon icon="fas fa-search" />
            <span>Buscar</span>
        </button>
    </div>

    
    <h2 class="text-2xl font-bold mb-6 text-dark-primary-blue border-b-2 border-dark-primary-blue pb-2">Planes de Cremación</h2>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      
      <div 
        v-for="servicio in serviciosFiltrados" 
        :key="servicio.id" 
        class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-dark-primary-blue hover:shadow-xl transition duration-300 relative"
      >
        
        <div 
             @click.stop="toggleMenu(servicio.id, 'servicio')"
             class="absolute top-2 right-2 bg-dark-primary-blue text-white p-2 rounded-lg cursor-pointer hover:bg-opacity-90 transition duration-150"
             title="Opciones de Gestión">
          <font-awesome-icon icon="fas fa-ellipsis-v" class="text-lg" />
        </div>
        
        <div v-if="activeMenu === servicio.id && activeMenuType === 'servicio'"
             class="absolute top-12 right-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-32">
          
          <button @click.stop="verDetalleProducto(servicio)"
                  class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Ver Detalle</button>
          
          <button @click.stop="simularEdicion(servicio)"
                  class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Editar</button>
          <button @click.stop="simularEliminar(servicio)"
                  class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">Eliminar</button>
        </div>


        <h2 class="text-xl font-semibold mb-3 text-dark-primary-blue mt-2 font-sans">{{ servicio.nombre }}</h2>
        
        <div class="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500 font-sans">
          [IMAGEN DE SERVICIO]
        </div>
        
        <p class="text-xs font-semibold text-cyan-700">{{ servicio.tipo.toUpperCase() }}</p>
        <p class="text-gray-600 mb-4 font-sans text-sm h-12 overflow-hidden">{{ servicio.descripcion }}</p>
        
        <p class="text-xl font-bold mb-4 text-gray-800 font-sans">
          Precio: ${{ servicio.precio.toLocaleString('es-CL') }} CLP
        </p>
        
        <button 
          @click="iniciarReserva(servicio)"
          class="w-full bg-cyan-700 text-white py-2 rounded-md font-semibold hover:bg-cyan-800 transition duration-150 font-sans"
        >
          Seleccionar Servicio
        </button>
      </div>
      <p v-if="serviciosFiltrados.length === 0 && (busquedaTexto || filtroTipo !== 'todos' || filtroPrecio !== 'todos')" class="text-gray-500">No se encontraron servicios de cremación con estos criterios.</p>
    </section>


    <h2 class="text-2xl font-bold mb-6 text-dark-primary-blue border-b-2 border-dark-primary-blue pb-2">Urnas y Accesorios Disponibles</h2>

    <section class="relative mb-12">
      <div id="scroll-container" class="flex overflow-x-scroll snap-x snap-mandatory space-x-6 pb-4">

        <div 
          @click="goToAdminInventario"
          class="flex-shrink-0 w-64 bg-gray-100 p-6 rounded-lg shadow-lg border-t-4 border-gray-400 hover:shadow-2xl transition duration-300 cursor-pointer hover:bg-gray-200 snap-center"
        >
          <div class="h-full flex flex-col justify-center items-center">
            <font-awesome-icon icon="fas fa-plus-circle" class="text-5xl text-gray-500 mb-2" />
            <h2 class="text-lg font-semibold text-gray-600 mt-2 text-center">Agregar Ítem (Admin)</h2>
            <p class="text-xs text-gray-400 mt-1">(Gestionar Inventario)</p>
          </div>
        </div>


        <div 
          v-for="item in accesoriosFiltrados" 
          :key="item.id" 
          class="flex-shrink-0 w-64 bg-white p-5 rounded-lg shadow-md border-t-4 border-dark-primary-blue hover:shadow-xl transition duration-300 relative snap-center"
        >
          
          <div 
               @click="toggleMenu(item.id, 'accesorio')"
               class="absolute top-2 right-2 bg-dark-primary-blue text-white p-2 rounded-lg cursor-pointer hover:bg-opacity-90 transition duration-150"
               title="Opciones de Gestión">
            <font-awesome-icon icon="fas fa-ellipsis-v" class="text-base" />
          </div>
          
          <div v-if="activeMenu === item.id && activeMenuType === 'accesorio'"
               class="absolute top-10 right-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-32">
            
            <button @click.stop="verDetalleProducto(item)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Ver Detalle</button>
            
            <button @click.stop="simularEdicion(item)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Editar</button>
            <button @click.stop="simularEliminar(item)"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">Eliminar</button>
          </div>


          <h3 class="text-lg font-semibold mb-2 text-dark-primary-blue">{{ item.nombre }}</h3>
          <p class="text-xs font-semibold text-cyan-700">{{ item.tipo.toUpperCase() }}</p>
          
          <div class="w-full h-28 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-500 text-sm">
            [IMAGEN DE {{ item.tipo.toUpperCase() }}]
          </div>

          <p class="text-sm font-bold mb-4 text-gray-800 font-sans">
            Precio: ${{ item.precio.toLocaleString('es-CL') }} CLP
          </p>
          
          <button 
            @click="iniciarReserva(item)"
            class="w-full bg-cyan-700 text-white py-2 rounded-md font-semibold hover:bg-cyan-800 transition duration-150 text-sm"
          >
            Añadir al Pedido
          </button>
        </div>
        
        <p v-if="accesoriosFiltrados.length === 0 && (busquedaTexto || filtroTipo !== 'todos' || filtroPrecio !== 'todos')" class="text-gray-500 mt-4">No se encontraron productos con estos criterios.</p>
      </div>

      <div class="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-4">
        <button 
          @click="scrollRight" 
          class="pointer-events-auto bg-gray-800 text-white p-3 rounded-full opacity-70 hover:opacity-100 shadow-xl transition"
          aria-label="Siguiente Producto">
          <font-awesome-icon icon="fas fa-arrow-right" class="text-lg" />
        </button>
      </div>
    </section>

    <div class="mt-16 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-6 text-dark-primary-blue border-b-2 border-gray-300 pb-2">Preguntas Frecuentes (FAQ)</h2>
        
        <div class="space-y-4">
            <details class="bg-white p-4 rounded-lg shadow-md border-l-4 border-cyan-700 cursor-pointer">
                <summary class="font-semibold text-dark-primary-blue">¿El Plan Económico incluye la devolución de cenizas?</summary>
                <p class="mt-2 text-gray-600 text-sm">No, el Servicio Económico es un proceso colectivo digno que no incluye la recuperación individual de cenizas ni la entrega de urna. Es una opción de despedida de bajo costo.</p>
            </details>
            <details class="bg-white p-4 rounded-lg shadow-md border-l-4 border-cyan-700 cursor-pointer">
                <summary class="font-semibold text-dark-primary-blue">¿Cómo funciona la trazabilidad?</summary>
                <p class="mt-2 text-gray-600 text-sm">Al contratar el Plan Premium, le asignamos un código único. Usted puede rastrear el estado de su servicio en línea, garantizando que los restos coincidan con la urna final.</p>
            </details>
            <details class="bg-white p-4 rounded-lg shadow-md border-l-4 border-cyan-700 cursor-pointer">
                <summary class="font-semibold text-dark-primary-blue">¿Qué hago en caso de emergencia fuera de horario?</summary>
                <p class="mt-2 text-gray-600 text-sm">Nuestras instalaciones están disponibles de 09:00 a 18:00 hrs. Sin embargo, para **emergencias** (fallecimiento fuera de horario), puede contactarnos inmediatamente al número de WhatsApp flotante (24/7).</p>
            </details>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV, faPlusCircle, faArrowRight, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faEllipsisV, faPlusCircle, faArrowRight, faSearch, faArrowLeft); 

const router = useRouter();

// --- ESTADO DE FILTRO Y BÚSQUEDA ---
const busquedaTexto = ref('');
const filtroTipo = ref('todos'); 
const filtroPrecio = ref('todos'); 
const activeMenu = ref<string | null>(null);
const activeMenuType = ref<string | null>(null);

// Lógica para cerrar el menú desplegable al hacer clic fuera
const closeMenuOnClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (activeMenu.value && !target.closest('.absolute.top-12') && !target.closest('.absolute.top-10')) {
        activeMenu.value = null; 
        activeMenuType.value = null;
    }
};

onMounted(() => {
  window.addEventListener('click', closeMenuOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', closeMenuOnClickOutside);
});

// Función para abrir/cerrar el menú desplegable
const toggleMenu = (id: string, type: string) => {
  if (activeMenu.value === id && activeMenuType.value === type) {
    activeMenu.value = null; 
    activeMenuType.value = null;
  } else {
    activeMenu.value = id; 
    activeMenuType.value = type;
  }
};

// LÓGICA DE SCROLL (Manejador de la flecha)
const scrollRight = () => {
  const container = document.getElementById('scroll-container');
  if (container) {
    container.scrollLeft += 300; 
  }
};


// 1. SERVICIOS DE CREMACIÓN (Datos sin filtrar)
const serviciosRaw = ref([
  { id: 'S003', nombre: 'Servicio Premium', tipo: 'Servicio', precio: 165000, 
    descripcion: 'INCLUYE: Trazabilidad, Recogida a domicilio, Urna personalizable y Certificado.', 
    requierePersonalizacion: true 
  }, 
  { id: 'S002', nombre: 'Servicio Estándar', tipo: 'Servicio', precio: 95000, 
    descripcion: 'INCLUYE: Servicio de cremación y opción de elegir una urna personalizable.', 
    requierePersonalizacion: true 
  },
  { id: 'S001', nombre: 'Servicio Económico', tipo: 'Servicio', precio: 40000, 
    descripcion: 'INCLUYE: Proceso colectivo y certificado. No incluye urna ni recuperación de cenizas.', 
    requierePersonalizacion: true 
  }, 
]);

// 2. PRODUCTOS Y ACCESORIOS (Datos sin filtrar)
const productosAccesoriosRaw = ref([
  { id: 'U001', nombre: 'Urna de Mármol "Eternidad"', tipo: 'Urna', precio: 85000, requierePersonalizacion: true },
  { id: 'U002', nombre: 'Urna de Madera "Paz"', tipo: 'Urna', precio: 50000, requierePersonalizacion: true },
  { id: 'U003', nombre: 'Urna "Siembra Vida"', tipo: 'Urna', precio: 60000, requierePersonalizacion: true },
  { id: 'U004', nombre: 'Urna Metálica "Guardián"', tipo: 'Urna', precio: 45000, requierePersonalizacion: true },
  { id: 'U005', nombre: 'Urna Cobre "Luminiscente"', tipo: 'Urna', precio: 90000, requierePersonalizacion: true },
  { id: 'A001', nombre: 'Grabado Láser (Adicional)', tipo: 'Accesorio', precio: 15000, requierePersonalizacion: true },
  { id: 'A002', nombre: 'Cofre de Huella', tipo: 'Accesorio', precio: 25000, requierePersonalizacion: false },
  { id: 'L001', nombre: 'Servicio de Recogida', tipo: 'Servicio Extra', precio: 20000, requierePersonalizacion: false },
]);

// --- LÓGICA DE FILTRADO Y BÚSQUEDA ---

const busquedaActiva = ref(false); // Bandera para saber si se ha presionado el botón

const aplicarFiltroPrecio = (precio: number) => {
    switch (filtroPrecio.value) {
        case 'bajo': return precio < 50000;
        case 'medio': return precio >= 50000 && precio <= 100000;
        case 'alto': return precio > 100000;
        default: return true;
    }
};

const filtrarItems = (items: any[]) => {
    if (!busquedaActiva.value && !busquedaTexto.value && filtroTipo.value === 'todos' && filtroPrecio.value === 'todos') {
        return items; // Mostrar todos si no hay búsqueda activa ni filtros seleccionados
    }
    
    // Si se activó la búsqueda o hay filtros seleccionados, aplicarlos
    return items.filter(item => {
        const textoMinuscula = busquedaTexto.value.toLowerCase();
        
        // El filtro de tipo se aplica solo si no es 'todos'
        const coincideTipo = filtroTipo.value === 'todos' || item.tipo === filtroTipo.value || (item.tipo === 'Servicio Extra' && filtroTipo.value === 'Servicio');

        // El filtro de precio se aplica solo si no es 'todos'
        const coincidePrecio = filtroPrecio.value === 'todos' ? true : aplicarFiltroPrecio(item.precio);

        // La búsqueda por texto se aplica si hay texto
        const coincideTexto = !textoMinuscula || 
                              item.nombre.toLowerCase().includes(textoMinuscula) || 
                              item.descripcion?.toLowerCase().includes(textoMinuscula);

        return coincideTipo && coincidePrecio && coincideTexto;
    });
};

const serviciosFiltrados = computed(() => {
    return filtrarItems(serviciosRaw.value.filter(s => s.tipo === 'Servicio'));
});

const accesoriosFiltrados = computed(() => {
    // Filtramos solo urnas, accesorios y servicios extra para esta sección
    return filtrarItems(productosAccesoriosRaw.value.filter(p => p.tipo !== 'Servicio'));
});

// Función que se dispara al hacer clic en "Buscar"
const ejecutarBusquedaCompleta = () => {
    busquedaActiva.value = true;
    // La reactividad de Vue se encarga de re-evaluar los computed (serviciosFiltrados y accesoriosFiltrados)
};


// --- FUNCIONES DE ACCIÓN ---

const verDetalleProducto = (producto: any) => {
  sessionStorage.setItem('detalle_producto', JSON.stringify(producto));
  activeMenu.value = null; 
  activeMenuType.value = null;
  router.push('/detalle-producto'); 
};

const simularEdicion = (producto: any) => {
    alert(`SIMULACIÓN DE EDICIÓN:\n\nAbriendo formulario de gestión para: ${producto.nombre}.\n\nAquí se cargaría la ruta /admin/editar-producto/${producto.id}`);
};

const simularEliminar = (producto: any) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
        alert(`SIMULACIÓN DE ELIMINACIÓN:\n\nEl ítem "${producto.nombre}" ha sido eliminado.`);
    }
};

const iniciarReserva = (producto: any) => {
  alert(`SIMULACIÓN: Se inicia el flujo de reserva/añadir al carrito con el producto: ${producto.nombre}.`);
};

const goToAdminInventario = () => {
  alert(`SIMULACIÓN: Navegando a la página de administración de Inventario para añadir un nuevo producto/servicio.`);
  // Aquí debería ir la navegación a la página de administración de inventario
  // router.push('/admin/inventario'); 
};


definePageMeta({
  title: 'Catálogo de Servicios y Productos',
});
</script>

<style scoped>
/* Consistencia de colores */
.text-dark-primary-blue {
    color: #34495e; /* Gris Carbón */
}
.border-dark-primary-blue {
    border-color: #34495e;
}
.border-cyan-700 {
    border-color: #17a2b8; /* Cyan principal */
}
.bg-cyan-700 {
    background-color: #17a2b8;
}
.hover\:bg-cyan-800:hover {
    background-color: #0f869a;
}
/* Estilo para el contenedor de scroll horizontal */
#scroll-container {
  /* Ocultar la barra de scroll en navegadores basados en Webkit */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
#scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>