<template>
<div class="min-h-screen pt-14 font-sans antialiased"> 
    
    <!-- BANNER DE HEROE -->
    <div class="relative w-full h-96 overflow-hidden -mt-14">
      <div 
        class="relative w-full h-full bg-cover bg-center shadow-xl hero-background" 
        style="background-image: url('/photo-1544568100-847a948585b9.jpg');" 
        alt="Dignidad y Respeto para su Compañero de Vida"
      >
        <div class="absolute inset-0 bg-opacity-50"></div> 
        
        <div class="relative z-10 text-white text-center flex flex-col justify-center h-full container mx-auto px-4">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Dignidad y Respeto para su Compañero de Vida
          </h1>
          <p class="text-xl font-light max-w-2xl mx-auto drop-shadow-md">
            Sabemos que su mascota es familia. Elija el servicio y productos que mejor honren su amor y su memoria.
          </p>
        </div>
      </div>
    </div>

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
                <option value="todos" disabled hidden>-- Categoría --</option> 
                <option value="todos">Todos los Productos</option> 
                <option value="Servicio">Servicios de Cremación</option>
                <option value="Urna">Urnas</option>
                <option value="Accesorio">Accesorios</option>
            </select>

            <select 
                v-model="filtroPrecio"
                class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none bg-white transition duration-150 shadow-inner text-sm appearance-none cursor-pointer"
            >
                <option value="todos" disabled hidden>-- Precio --</option>
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
        
        <!-- SECCIÓN: SERVICIOS DE CREMACIÓN -->
        <div class="flex justify-between items-center mb-6 border-b-2 border-purple-deep pb-2">
            <h2 class="text-3xl font-bold text-purple-dark">
                <font-awesome-icon icon="fas fa-heart" class="mr-2 text-red-500" /> Servicios de Cremación
            </h2>
            <!-- Simulación de enlace de administrador -->
            <router-link to="/admin/inventario" class="hidden md:block">
                <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md whitespace-nowrap">
                    Ver Inventario (Admin)
                </button>
            </router-link>
        </div>
        
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            
            <!-- TARJETA DE SERVICIO (Diseño Moderno) -->
            <div 
                v-for="servicio in serviciosFiltrados" 
                :key="servicio.id" 
                class="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-300 relative border-t-8 border-t-purple-deep cursor-pointer"
                @click="verDetalleProducto(servicio)"
            >
                <!-- Botón de Opciones (...) -->
                <div class="absolute top-4 right-4 z-10">
                    <button @click.stop="toggleMenu(servicio.id, 'servicio')" 
                            class="options-button w-8 h-8 rounded-full shadow-lg transition duration-200 flex items-center justify-center relative 
                                        bg-white hover:bg-gray-100 text-purple-deep"> 
                        <font-awesome-icon icon="fas fa-ellipsis-v" class="text-sm" />
                    </button>
                    
                    <!-- Menú Desplegable -->
                    <div v-if="activeMenu === servicio.id && activeMenuType === 'servicio'"
                            class="menu-dropdown absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-200">
                        
                        <button @click.stop="verDetalleProducto(servicio)"
                                class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-card text-sm transition duration-100">
                            <font-awesome-icon icon="fas fa-question-circle" class="mr-2 text-purple-deep" /> Ver Detalle
                        </button>

                        <button @click.stop="simularEliminar(servicio)"
                                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm transition duration-100">
                                <font-awesome-icon icon="fas fa-trash-alt" class="mr-2" /> Eliminar (Admin)
                        </button>
                    </div>
                </div>

                <!-- Imagen del Producto -->
                <img :src="servicio.imagenUrl" :alt="servicio.nombre" class="w-full h-40 object-cover"/>

                <!-- Contenido de la Tarjeta -->
                <div class="p-5">
                    
                    <!-- Tipo de Producto (Badge) -->
                    <span class="bg-purple-deep text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm mb-3 inline-block">
                        {{ servicio.tipo }}
                    </span>

                    <h2 class="text-xl font-bold text-purple-dark mb-2 h-12 overflow-hidden">{{ servicio.nombre }}</h2>
                    <p class="text-gray-600 mb-4 text-sm h-10 overflow-hidden">{{ servicio.descripcion }}</p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-extrabold text-bd-gold-accent">
                            ${{ servicio.precio.toLocaleString('es-CL') }}
                        </span>
                        <span class="text-sm text-gray-500">
                            ID: {{ servicio.id }}
                        </span>
                    </div>
                    
                    <!-- BOTÓN DE ACCIÓN (Navega a /carrito) -->
                    <button 
                        @click.stop="irACarrito(servicio)"
                        class="w-full py-3 rounded-xl font-bold text-lg transition duration-300 shadow-lg 
                                 bg-purple-deep text-white hover:bg-purple-light hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-deep/50"
                    >
                        <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2" />
                        Seleccionar Servicio
                    </button>

                </div>
            </div>
            
            <p v-if="serviciosFiltrados.length === 0" class="text-gray-500 col-span-full text-center mt-4 p-8 bg-gray-100 rounded-lg shadow-inner">
                <font-awesome-icon icon="fas fa-times-circle" class="mr-2 text-red-400" />
                No se encontraron servicios de cremación con estos criterios.
            </p>
        </section>

        
        <!-- SECCIÓN: URNAS Y ACCESORIOS -->
        <div class="flex justify-between items-center mb-6 border-b-2 border-purple-deep pb-2 mt-12">
            <h2 class="text-3xl font-bold text-purple-dark">
                <font-awesome-icon icon="fas fa-box" class="mr-2 text-bd-gold-accent" /> Urnas y Accesorios
            </h2>
            <!-- Simulación de enlace de administrador -->
            <router-link to="/admin/inventario" class="hidden md:block">
                <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md whitespace-nowrap">
                    Ver Inventario (Admin)
                </button>
            </router-link>
        </div>
        
        <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            
            <!-- TARJETA DE ACCESORIO/URNA (Diseño Moderno) -->
            <div 
                v-for="item in accesoriosFiltrados" 
                :key="item.id" 
                class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300 relative border-t-4 border-t-bd-gold-accent cursor-pointer"
                @click="verDetalleProducto(item)"
            >
                <!-- Botón de Opciones (...) -->
                <div class="absolute top-2 right-2 z-10">
                    <button @click.stop="toggleMenu(item.id, 'accesorio')" 
                            class="options-button w-7 h-7 rounded-full shadow-md transition duration-200 flex items-center justify-center relative 
                                         bg-white hover:bg-gray-100 text-purple-deep"> 
                        <font-awesome-icon icon="fas fa-ellipsis-v" class="text-xs" />
                    </button>
                    
                    <!-- Menú Desplegable -->
                    <div v-if="activeMenu === item.id && activeMenuType === 'accesorio'"
                            class="menu-dropdown absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-200">
                        
                        <button @click.stop="verDetalleProducto(item)"
                                class="block w-full text-left px-3 py-1.5 text-gray-800 hover:bg-purple-card text-xs transition duration-100">
                            <font-awesome-icon icon="fas fa-question-circle" class="mr-2 text-purple-deep" /> Ver Detalle
                        </button>

                        <button @click.stop="simularEliminar(item)"
                                class="block w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs transition duration-100">
                            <font-awesome-icon icon="fas fa-trash-alt" class="mr-2" /> Eliminar (Admin)
                        </button>
                    </div>
                </div>

                <!-- Imagen del Producto -->
                <img :src="item.imagenUrl" :alt="item.nombre" class="w-full h-32 object-cover"/>

                <!-- Contenido de la Tarjeta -->
                <div class="p-3">
                    
                    <!-- Tipo de Producto (Badge) -->
                    <span :class="{
                        'bg-bd-gold-accent text-purple-dark': item.tipo === 'Urna',
                        'bg-gray-300 text-gray-800': item.tipo === 'Accesorio'
                    }" class="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm mb-2 inline-block">
                        {{ item.tipo }}
                    </span>

                    <h3 class="text-base font-semibold text-purple-dark mb-1 h-10 overflow-hidden">{{ item.nombre }}</h3>
                    
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xl font-extrabold text-purple-dark">
                            ${{ item.precio.toLocaleString('es-CL') }}
                        </span>
                    </div>
                    
                    <!-- BOTÓN DE ACCIÓN (Navega a /carrito) -->
                    <button 
                        @click.stop="irACarrito(item)"
                        class="w-full py-2 rounded-lg font-bold text-sm transition duration-300 shadow-md 
                                 bg-bd-gold-accent text-purple-dark hover:bg-yellow-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-bd-gold-accent/50"
                    >
                        <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2" />
                        Añadir al Pedido
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV, faPlusCircle, faSearch, faShoppingCart, faHeart, faBox, faQuestionCircle, faFilter, faTrashAlt, faChevronDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

// Añadir el ícono de basura para la simulación de eliminación y flechas
library.add(faEllipsisV, faPlusCircle, faSearch, faShoppingCart, faHeart, faBox, faQuestionCircle, faFilter, faTrashAlt, faChevronDown, faTimesCircle); 

// Definición de la interfaz del producto
interface Product {
    id: string;
    nombre: string;
    tipo: 'Servicio' | 'Urna' | 'Accesorio' | 'Servicio Extra';
    precio: number;
    descripcion: string;
    requierePersonalizacion: boolean;
    imagenUrl?: string;
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


// --- ARRAYS DE DATOS SIMULADOS (Con URLs de placeholder) ---

const servicios: Ref<Product[]> = ref([
    { id: 'S003', nombre: 'Servicio Premium Plus', tipo: 'Servicio', precio: 165000, 
      descripcion: 'INCLUYE: Trazabilidad completa, Recogida, Urna personalizable de alta gama y Certificado.', 
      requierePersonalizacion: true,
      imagenUrl: 'https://placehold.co/600x400/5C2A72/FFD700?text=Premium+Plus' 
    }, 
    { id: 'S002', nombre: 'Servicio Estándar', tipo: 'Servicio', precio: 95000, 
      descripcion: 'INCLUYE: Proceso de cremación individual y opción de elegir una urna personalizable.', 
      requierePersonalizacion: true,
      imagenUrl: 'https://placehold.co/600x400/4A235A/FFFFFF?text=Estandar' 
    },
    { id: 'S001', nombre: 'Servicio Económico', tipo: 'Servicio', precio: 40000, 
      descripcion: 'INCLUYE: Proceso colectivo y certificado. No incluye urna ni recuperación de cenizas.', 
      requierePersonalizacion: false,
      imagenUrl: 'https://placehold.co/600x400/777777/FFFFFF?text=Economico' 
    }, 
] as Product[]);

const productosAccesoriosRaw: Ref<Product[]> = ref([
    { id: 'U001', nombre: 'Urna de Mármol "Eternidad"', tipo: 'Urna', precio: 85000, descripcion: 'Urna de mármol elegante y solemne para un recuerdo duradero.', requierePersonalizacion: true, imagenUrl: 'https://placehold.co/600x400/D0D0D0/4A235A?text=Urna+Marmol' },
    { id: 'U002', nombre: 'Urna de Madera "Paz"', tipo: 'Urna', precio: 50000, descripcion: 'Urna de madera noble, sobria y cálida.', requierePersonalizacion: true, imagenUrl: 'https://placehold.co/600x400/964B00/FFFFFF?text=Urna+Madera' },
    { id: 'A002', nombre: 'Cofre de Huella', tipo: 'Accesorio', precio: 25000, descripcion: 'Un recuerdo tierno para conservar la huella de tu mascota.', requierePersonalizacion: false, imagenUrl: 'https://placehold.co/600x400/808080/FFFFFF?text=Cofre+Huella' },
    { id: 'U003', nombre: 'Urna "Siembra Vida"', tipo: 'Urna', precio: 60000, descripcion: 'Urna ecológica diseñada para plantar un árbol en memoria de tu mascota.', requierePersonalizacion: true, imagenUrl: 'https://placehold.co/600x400/1E8449/FFFFFF?text=Urna+Siembra' },
    { id: 'A001', nombre: 'Grabado Láser (Adicional)', tipo: 'Accesorio', precio: 15000, descripcion: 'Grabado de nombre, fecha o mensaje corto.', requierePersonalizacion: true, imagenUrl: 'https://placehold.co/600x400/4A235A/FFD700?text=Grabado+Laser' },
] as Product[]);


// --- LÓGICA DE FILTRADO Y BÚSQUEDA ---

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
        
        // El filtro de tipo solo se aplica si no es 'todos'
        const tipoDeseado = filtroTipoEjecutado.value.toLowerCase();
        const itemTipo = item.tipo.toLowerCase();
        
        // La lógica de tipo tiene que ser flexible para incluir sub-tipos si se filtra por 'todos' o el tipo específico
        const coincideTipo = tipoDeseado === 'todos' || itemTipo === tipoDeseado || (itemTipo === 'servicio extra' && tipoDeseado === 'servicio');

        const coincidePrecio = aplicarFiltroPrecio(item.precio, filtroPrecioEjecutado.value);

        const coincideTexto = !textoMinuscula || 
                               item.nombre.toLowerCase().includes(textoMinuscula) || 
                               item.descripcion.toLowerCase().includes(textoMinuscula);

        return coincideTipo && coincidePrecio && coincideTexto;
    });
};

const serviciosFiltrados = computed(() => {
    // Si el filtro de tipo ejecutado es 'Urna' o 'Accesorio', no mostramos nada en esta sección
    if (filtroTipoEjecutado.value === 'Urna' || filtroTipoEjecutado.value === 'Accesorio') {
        return [];
    }
    // Filtramos solo los servicios (incluyendo Servicio Extra si existiera, aunque el filtro es por 'Servicio')
    const items = servicios.value.filter(s => s.tipo.includes('Servicio'));
    return filtrarItems(items);
});

const accesoriosFiltrados = computed(() => {
    // Si el filtro de tipo ejecutado es 'Servicio', no mostramos nada en esta sección
    if (filtroTipoEjecutado.value === 'Servicio') {
        return [];
    }
    // Filtramos Urnas y Accesorios
    const items = productosAccesoriosRaw.value.filter(item => item.tipo === 'Urna' || item.tipo === 'Accesorio');
    return filtrarItems(items);
});


// --- LÓGICA DE INTERACCIÓN Y NAVEGACIÓN (CRÍTICO) ---

const closeMenuOnClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // Asegurarse de que el clic no fue dentro del menú ni en el botón que lo abre
    if (activeMenu.value && !target.closest('.menu-dropdown') && !target.closest('.options-button')) {
        activeMenu.value = null; 
        activeMenuType.value = null;
    }
};

onMounted(() => {
    // Escucha global para cerrar el menú al hacer clic fuera
    document.addEventListener('click', closeMenuOnClickOutside);
    ejecutarBusquedaCompleta(); // Muestra todos los productos al cargar
});

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnClickOutside);
});

const toggleMenu = (id: string, type: string) => {
    if (activeMenu.value === id && activeMenuType.value === type) {
        activeMenu.value = null; // Cierra si ya está abierto
        activeMenuType.value = null;
    } else {
        activeMenu.value = id; // Abre el nuevo menú
        activeMenuType.value = type;
    }
};

/**
 * Función CRÍTICA: Navega a la página de detalle del producto.
 * Se llama desde el menú desplegable (opción "Ver Detalle") y al hacer clic en la tarjeta.
 * @param producto El producto (servicio, urna o accesorio) a ver en detalle.
 */
const verDetalleProducto = (producto: Product) => {
    console.log(`Navegando a detalles del producto: ${producto.nombre} (${producto.id})`);
    activeMenu.value = null; 
    activeMenuType.value = null;
    // Guardamos el producto seleccionado para simular que la página de detalle lo cargará
    sessionStorage.setItem('detalle_producto_seleccionado', JSON.stringify(producto));
    // Navegación a la ruta /detalle-producto/:id
    router.push(`/detalle-producto/${producto.id}`); 
};

const simularEliminar = (producto: Product) => {
    // Implementación de modal custom en un entorno real. Aquí solo logeamos.
    console.log(`Simulación: Mostrar modal para confirmar eliminación de "${producto.nombre}"`);
    activeMenu.value = null; 
    activeMenuType.value = null;
};

/**
 * Función CRÍTICA: Añade el producto al carrito (simulado) y navega al carrito de compras.
 * @param producto El producto (servicio, urna o accesorio) a añadir.
 */
const irACarrito = (producto: Product) => {
    // Aquí iría la lógica real para añadir el producto al estado global del carrito
    sessionStorage.setItem('producto_reserva', JSON.stringify(producto));
    console.log(`Producto ${producto.nombre} añadido al pedido. Navegando a /carrito.`);
    
    // CRITICAL: Navegación solicitada al carrito de compras
    router.push('/carrito');
};

definePageMeta({
    title: 'Catálogo de Servicios'
});
</script>

<style scoped>
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

/* CLASE CRUCIAL: Definición de la imagen de fondo */
.hero-background {
    /* Usamos un fondo morado oscuro con superposición para un look más solemne y profesional */
    background-image: url('https://placehold.co/1920x400/4A235A/FFFFFF?text=Dignidad+y+Respeto');
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

/* Ocultar flecha nativa de los select para usar el estilo de Tailwind por defecto */
select {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath fill='%236B7280' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3e%3c/svg%3e");
    background-position: right 0.7rem center;
    background-size: 1.5em 1.5em;
    background-repeat: no-repeat;
    padding-right: 2.5rem;
}

</style>