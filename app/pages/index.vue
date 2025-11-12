<template>
<div class="min-h-screen pt-14 font-sans antialiased"> 
    
    <!-- BANNER DE HEROE -->
    <div class="relative w-full h-96 overflow-hidden -mt-14">
      <div 
        class="relative w-full h-full bg-cover bg-center shadow-xl hero-background" 
        style="background-image: url('/index.jpg');" 
        alt="Dignidad y Respeto para su Compañero de Vida"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div> 
        
        <div class="relative z-10 text-white text-center flex flex-col justify-center h-full container mx-auto px-4">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            APOYO EN LOS MOMENTOS
            MÁS DIFÍCILES
          </h1>
          <p class="text-xl font-light max-w-2xl mx-auto drop-shadow-md">
            ENTREGANDO UN SERVICIO PROFESIONAL, RESPETUOSO Y EMPÁTICO PARA QUIENES PIERDEN A UN SER QUERIDO.
          </p>
        </div>
      </div>
    </div>

    <!-- (ACTUALIZADO) BARRA DE FILTRO (Funcional) -->
    <div class="container mx-auto px-4 -mt-16 relative z-20">
      <div class="bg-white p-6 md:p-8 rounded-xl shadow-2xl border-t-8 border-purple-deep">
        <h2 class="text-xl font-extrabold text-purple-dark mb-4 flex items-center">
            <font-awesome-icon icon="fas fa-filter" class="mr-3 text-bd-gold-accent" /> Filtro de Búsqueda de Productos
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            <div class="relative w-full">
                <input 
                    type="text" 
                    v-model="busquedaTexto" 
                    placeholder="Buscar por Urna, Servicio o palabra clave..."
                    class="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none transition duration-150 shadow-inner text-sm"
                    @keyup.enter="ejecutarBusquedaCompleta"
                />
                <font-awesome-icon icon="fas fa-search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select 
                v-model="filtroTipo"
                class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none bg-white transition duration-150 shadow-inner text-sm appearance-none cursor-pointer"
            >
                <option value="todos">Todos los Productos</option> 
                <option value="Servicio">Servicios de Cremación</option>
                <option value="Urna">Urnas</option>
                <option value="Otro">Accesorios y Otros</option>
            </select>

            <select 
                v-model="filtroPrecio"
                class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none bg-white transition duration-150 shadow-inner text-sm appearance-none cursor-pointer"
            >
                <option value="todos">Cualquier Precio</option>
                <option value="bajo">Menos de $50.000</option>
                <option value="medio">$50.000 - $100.000</option>
                <option value="alto">Más de $100.000</option>
            </select>
            
            <button 
                @click="ejecutarBusquedaCompleta" 
                class="w-full bg-bd-gold-accent text-purple-dark py-3 rounded-xl font-bold hover:bg-yellow-500 transition duration-150 shadow-lg flex items-center justify-center space-x-2 border-2 border-yellow-600 focus:ring-4 focus:ring-yellow-300"
            >
                <font-awesome-icon icon="fas fa-search" />
                <span>Aplicar Filtros</span>
            </button>
        </div>
      </div>
    </div>


    <div class="container mx-auto px-4 py-12">
        
        <!-- (NUEVO) Indicador de Carga General -->
        <div v-if="pending" class="text-center py-10">
            <h2 class="text-2xl font-bold text-purple-dark">Cargando productos...</h2>
        </div>
        
        <!-- (NUEVO) Indicador de Error General -->
        <div v-else-if="error" class="text-center py-10 bg-red-50 text-red-700 rounded-lg shadow">
            <h2 class="text-2xl font-bold">Error al cargar productos</h2>
            <p>{{ error.message }}</p>
        </div>

        <!-- Contenido principal -->
        <div v-else>
            <!-- SECCIÓN: SERVICIOS DE CREMACIÓN -->
            <div class="flex justify-between items-center mb-6 border-b-2 border-purple-deep pb-2">
                <h2 class="text-3xl font-bold text-purple-dark">
                    <font-awesome-icon icon="fas fa-heart" class="mr-2 text-red-500" /> Nuestros servicios
                </h2>
                <!-- (CORREGIDO) router-link a NuxtLink -->
                <NuxtLink to="/admin/inventario" class="hidden md:block">
                    <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md whitespace-nowrap">
                        Ver Inventario
                    </button>
                </NuxtLink>
            </div>
            
            <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                
                <!-- (ACTUALIZADO) TARJETA DE SERVICIO (Conectada a la API) -->
                <div 
                    v-for="servicio in serviciosFiltrados" 
                    :key="servicio.id" 
                    class="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-300 relative border-t-8 border-t-purple-deep cursor-pointer"
                    @click="verDetalleProducto(servicio)"
                >
                    <!-- (REEMPLAZADO) Imagen Placeholder (BD no tiene imagen) -->
                    <div class="w-full h-40 object-cover bg-gray-200 flex items-center justify-center">
                        <img src="/logo2.png" alt="Logo de servicio" class="h-20 opacity-30"/>
                    </div>

                    <!-- Contenido de la Tarjeta -->
                    <div class="p-5 flex flex-col flex-grow">
                        <span class="bg-purple-deep text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm mb-3 inline-block self-start">
                            {{ servicio.tipo }}
                        </span>

                        <h2 class="text-xl font-bold text-purple-dark mb-2 h-12 overflow-hidden">{{ servicio.nombre }}</h2>
                        
                        <!-- (REEMPLAZADO) Descripción Estática (BD no tiene descripción) -->
                        <ul class="text-gray-600 mb-4 text-sm flex-grow">
                            <li class="flex items-center"><font-awesome-icon icon="fas fa-check" class="text-green-500 mr-2 text-xs" /> Certificado de Cremación</li>
                            <li class="flex items-center"><font-awesome-icon icon="fas fa-check" class="text-green-500 mr-2 text-xs" /> Urna (Modelo Básico)</li>
                        </ul>
                        
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-2xl font-extrabold text-bd-gold-accent">
                                ${{ servicio.precio.toLocaleString('es-CL') }}
                            </span>
                            <span class="text-sm text-gray-500">
                                ID: {{ servicio.id }}
                            </span>
                        </div>
                        
                        <!-- (ACTUALIZADO) Botón ahora navega a detalle-producto -->
                        <button 
                            @click.stop="verDetalleProducto(servicio)"
                            class="w-full py-3 rounded-xl font-bold text-lg transition duration-300 shadow-lg mt-auto
                                   bg-purple-deep text-white hover:bg-purple-light hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-deep/50"
                        >
                            <font-awesome-icon icon="fas fa-search" class="mr-2" />
                            Ver Detalles
                        </button>
                    </div>
                </div>
                
                <p v-if="serviciosFiltrados.length === 0" class="text-gray-500 col-span-full text-center mt-4 p-8 bg-gray-100 rounded-lg shadow-inner">
                    <font-awesome-icon icon="fas fa-times-circle" class="mr-2 text-red-400" />
                    No se encontraron servicios con estos criterios.
                </p>
            </section>

            
            <!-- SECCIÓN: URNAS Y ACCESORIOS -->
            <div class="flex justify-between items-center mb-6 border-b-2 border-purple-deep pb-2 mt-12">
                <h2 class="text-3xl font-bold text-purple-dark">
                    <font-awesome-icon icon="fas fa-box" class="mr-2 text-bd-gold-accent" /> Productos y Urnas
                </h2>
                <NuxtLink to="/admin/inventario" class="hidden md:block">
                    <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md whitespace-nowrap">
                        Ver Inventario
                    </button>
                </NuxtLink>
            </div>
            
            <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                
                <!-- (ACTUALIZADO) TARJETA DE ACCESORIO/URNA (Conectada a la API) -->
                <div 
                    v-for="item in accesoriosFiltrados" 
                    :key="item.id" 
                    class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300 relative border-t-4 border-t-bd-gold-accent cursor-pointer"
                    @click="verDetalleProducto(item)"
                >
                    <!-- (REEMPLAZADO) Imagen Placeholder -->
                    <div class="w-full h-32 object-cover bg-gray-200 flex items-center justify-center">
                        <img src="/logo2.png" alt="Logo de producto" class="h-16 opacity-30"/>
                    </div>

                    <!-- Contenido de la Tarjeta -->
                    <div class="p-3 flex flex-col flex-grow">
                        <span :class="{
                            'bg-bd-gold-accent text-purple-dark': item.tipo === 'Urna',
                            'bg-gray-300 text-gray-800': item.tipo !== 'Urna'
                        }" class="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm mb-2 inline-block self-start">
                            {{ item.tipo }}
                        </span>

                        <h3 class="text-base font-semibold text-purple-dark mb-1 h-10 overflow-hidden">{{ item.nombre }}</h3>
                        
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xl font-extrabold text-purple-dark">
                                ${{ item.precio.toLocaleString('es-CL') }}
                            </span>
                        </div>
                        
                        <!-- (ACTUALIZADO) Botón ahora navega a detalle-producto -->
                        <button 
                            @click.stop="verDetalleProducto(item)"
                            class="w-full py-2 rounded-lg font-bold text-sm transition duration-300 shadow-md mt-auto
                                   bg-bd-gold-accent text-purple-dark hover:bg-yellow-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-bd-gold-accent/50"
                        >
                            <font-awesome-icon icon="fas fa-search" class="mr-2" />
                            Ver Detalles
                        </button>
                    </div>
                </div>
                
                <p v-if="accesoriosFiltrados.length === 0" class="text-gray-500 col-span-full text-center mt-4 p-8 bg-gray-100 rounded-lg shadow-inner">
                    <font-awesome-icon icon="fas fa-times-circle" class="mr-2 text-red-400" />
                    No se encontraron urnas o accesorios con estos criterios.
                </p>
            </section>


            <!-- SECCIÓN: PREGUNTAS FRECUENTES (FAQ) -->
            <div class="mt-16 max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold mb-6 text-purple-dark border-b-2 border-purple-deep pb-2">
                    <font-awesome-icon icon="fas fa-question-circle" class="mr-2 text-purple-deep" /> Preguntas Frecuentes (FAQ)
                </h2>
                
                <div class="space-y-4">
                    <details class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-bd-gold-accent cursor-pointer transition duration-300 hover:shadow-xl">
                        <summary class="font-bold text-purple-dark flex items-center justify-between">
                            ¿El Plan Económico incluye la devolución de cenizas?
                            <font-awesome-icon icon="fas fa-chevron-down" class="text-purple-deep ml-2 text-xs transform details-arrow transition-transform duration-300" />
                        </summary>
                        <p class="mt-3 text-gray-700 text-sm border-t border-gray-100 pt-3">No, el Servicio Económico es un proceso colectivo digno que no incluye la recuperación individual de cenizas ni la entrega de urna. Es una opción de despedida de bajo costo.</p>
                    </details>
                    <details class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-bd-gold-accent cursor-pointer transition duration-300 hover:shadow-xl">
                        <summary class="font-bold text-purple-dark flex items-center justify-between">
                            ¿Cómo funciona la trazabilidad?
                            <font-awesome-icon icon="fas fa-chevron-down" class="text-purple-deep ml-2 text-xs transform details-arrow transition-transform duration-300" />
                        </summary>
                        <p class="mt-3 text-gray-700 text-sm border-t border-gray-100 pt-3">Al contratar el Plan Premium, le asignamos un código único. Usted puede rastrear el estado de su servicio en línea, garantizando que los restos coincidan con la urna final. Ofrecemos total **transparencia**.</p>
                    </details>
                    <details class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-bd-gold-accent cursor-pointer transition duration-300 hover:shadow-xl">
                        <summary class="font-bold text-purple-dark flex items-center justify-between">
                            ¿Qué hago en caso de emergencia fuera de horario?
                            <font-awesome-icon icon="fas fa-chevron-down" class="text-purple-deep ml-2 text-xs transform details-arrow transition-transform duration-300" />
                        </summary>
                        <p class="mt-3 text-gray-700 text-sm border-t border-gray-100 pt-3">Nuestras instalaciones están disponibles de 09:00 a 18:00 hrs. Sin embargo, para **emergencias** (fallecimiento fuera de horario), puede contactarnos inmediatamente al número de WhatsApp flotante (24/7).</p>
                    </details>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faEllipsisV, faSearch, faShoppingCart, faHeart, faBox, 
    faQuestionCircle, faFilter, faTrashAlt, faChevronDown, faTimesCircle,
    faCheck // (NUEVO) Añadido para la lista estática
} from '@fortawesome/free-solid-svg-icons';

// Añadir todos los iconos necesarios
library.add(
    faEllipsisV, faSearch, faShoppingCart, faHeart, faBox, 
    faQuestionCircle, faFilter, faTrashAlt, faChevronDown, faTimesCircle,
    faCheck
); 

// (ACTUALIZADO) Definición de la interfaz del producto (coincide con la API)
interface Product {
    id: number;
    nombre: string;
    tipo: string;
    precio: number;
}

const router = useRouter();

// --- ESTADO DE FILTRO Y BÚSQUEDA ---
const busquedaTexto = ref('');
const filtroTipo = ref('todos'); 
const filtroPrecio = ref('todos'); 

const busquedaEjecutada = ref('');
const filtroTipoEjecutado = ref('todos');
const filtroPrecioEjecutado = ref('todos');

const activeMenu = ref<string | null>(null);
const activeMenuType = ref<string | null>(null);


// --- (ACTUALIZADO) Carga de Datos desde la API ---
const { 
  data: productos, 
  pending, 
  error 
} = await useAsyncData<Product[]>(
  'lista-productos-publicos',
  () => $fetch('/api/productos'),
  {
    default: () => []
  }
);


// --- LÓGICA DE FILTRADO Y BÚSQUEDA (Basada en tu template) ---

const ejecutarBusquedaCompleta = () => {
    busquedaEjecutada.value = busquedaTexto.value;
    filtroTipoEjecutado.value = filtroTipo.value;
    filtroPrecioEjecutado.value = filtroPrecio.value;
};

const aplicarFiltroPrecio = (precio: number, filtro: string) => {
    switch (filtro) {
        case 'bajo': return precio < 50000;
        case 'medio': return precio >= 50000 && precio <= 100000;
        case 'alto': return precio > 100000;
        default: return true;
    }
};

const filtrarItems = (items: Product[]) => {
    const textoMinuscula = busquedaEjecutada.value.toLowerCase();
    
    return items.filter(item => {
        const tipoDeseado = filtroTipoEjecutado.value.toLowerCase();
        const itemTipo = item.tipo.toLowerCase();
        
        const coincideTipo = tipoDeseado === 'todos' || itemTipo === tipoDeseado;
        const coincidePrecio = aplicarFiltroPrecio(item.precio, filtroPrecioEjecutado.value);
        const coincideTexto = !textoMinuscula || 
                              item.nombre.toLowerCase().includes(textoMinuscula);

        return coincideTipo && coincidePrecio && coincideTexto;
    });
};

// (ACTUALIZADO) Computed properties que filtran los datos de la API
const serviciosFiltrados = computed(() => {
    if (!productos.value) return [];
    if (['urna', 'otro', 'accesorio'].includes(filtroTipoEjecutado.value.toLowerCase())) {
        return [];
    }
    const items = productos.value.filter(s => s.tipo.toLowerCase() === 'servicio');
    return filtrarItems(items);
});

const accesoriosFiltrados = computed(() => {
    if (!productos.value) return [];
    if (filtroTipoEjecutado.value.toLowerCase() === 'servicio') {
        return [];
    }
    const items = productos.value.filter(item => 
        item.tipo.toLowerCase() === 'urna' || 
        item.tipo.toLowerCase() === 'otro' || 
        item.tipo.toLowerCase() === 'accesorio'
    );
    return filtrarItems(items);
});


// --- LÓGICA DE INTERACCIÓN Y NAVEGACIÓN (Basada en tu template) ---

const closeMenuOnClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (activeMenu.value && !target.closest('.menu-dropdown') && !target.closest('.options-button')) {
        activeMenu.value = null; 
        activeMenuType.value = null;
    }
};

onMounted(() => {
    document.addEventListener('click', closeMenuOnClickOutside);
    ejecutarBusquedaCompleta(); // Muestra todos los productos al cargar
});

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnClickOutside);
});

const toggleMenu = (id: number, type: string) => {
    const menuId = `${type}-${id}`;
    if (activeMenu.value === menuId) {
        activeMenu.value = null;
        activeMenuType.value = null;
    } else {
        activeMenu.value = menuId;
        activeMenuType.value = type;
    }
};

const verDetalleProducto = (producto: Product) => {
    console.log(`Navegando a detalles del producto: ${producto.nombre} (${producto.id})`);
    activeMenu.value = null; 
    activeMenuType.value = null;
    // (ACTUALIZADO) Navegación a la ruta /detalle-producto?id=...
    router.push(`/detalle-producto?id=${producto.id}`); 
};

const simularEliminar = (producto: Product) => {
    console.log(`Simulación: Mostrar modal para confirmar eliminación de "${producto.nombre}"`);
    activeMenu.value = null; 
    activeMenuType.value = null;
};

// (ACTUALIZADO) irACarrito ahora también va a verDetalleProducto
const irACarrito = (producto: Product) => {
    console.log(`Producto ${producto.nombre} seleccionado. Navegando a detalles.`);
    router.push(`/detalle-producto?id=${producto.id}`);
};

definePageMeta({
    title: 'Catálogo de Servicios'
});
</script>

<style scoped>

.bg-blue-100 {
    background-color: #e0f2fe;
} 
.text-blue-800 {   color: #1e40af;
}
/* 1. PALETA DE MORADOS Y PÚRPURAS */
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
    background-color: #5C2A72; /* Morado Oscuro/Profundo - USADO EN BOTONES Y BORDES */
}
.text-purple-deep {
    color: #5C2A72; 
}
.border-purple-deep {
    border-color: #5C2A72; 
}
.bg-purple-card {
    background-color: #F8F4FA; /* Tono de tarjeta con tinte púrpura (usado en hover) */
}

/* 2. DEFINICIÓN DE COLOR DE ACCENTO (DORADO/AMARILLO) */
.text-bd-gold-accent { 
    color: #FFD700; /* Dorado brillante - CRÍTICO para iconos y precios de servicios */
}
.bg-bd-gold-accent { 
    background-color: #FFD700; /* Dorado brillante - CRÍTICO para botones de accesorios y bordes */
}
.border-bd-gold-accent {
    border-color: #FFD700;
}
.border-yellow-600 {
    border-color: #D69E2E; /* Ocre para el botón de filtro */
}
.focus\:ring-yellow-300:focus {
    --tw-ring-color: #F6E05E;
}
.hover\:bg-yellow-500:hover {
    background-color: #ECC94B;
}

/* CLASE CRUCIAL: Definición de la imagen de fondo */
.hero-background {
    /* (ACTUALIZADO) Usando tu imagen real */
    background-image: url('/banner2.avif');
    background-blend-mode: multiply;
}

/* Estilos de transición para el botón de opciones */
.options-button {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
}

/* Estilo para la flecha de detalles (FAQ) */
details[open] .details-arrow {
    transform: rotate(180deg);
}

/* Ocultar flecha nativa de los select */
select {
    background-image: url("data:image/svg+xml;charset=UTF-ARREGLADO,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath fill='%236B7280' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3e%3c/svg%3e");
    background-position: right 0.7rem center;
    background-size: 1.5em 1.5em;
    background-repeat: no-repeat;
    padding-right: 2.5rem;
}
</style>