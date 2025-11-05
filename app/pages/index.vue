<template>
<div class="min-h-screen pt-14"> 
    
    <div class="relative w-full h-96 overflow-hidden -mt-14">
      <div 
        class="relative w-full h-full bg-cover bg-center shadow-xl hero-background" 
        style="background-image: url('/photo-1544568100-847a948585b9.jpg');" 
        alt="Dignidad y Respeto para su Compañero de Vida"
      >
        <div class="absolute inset-0 bg-opacity-40"></div> 
        
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
      <div class="bg-white-subtle p-6 md:p-8 rounded-xl shadow-2xl border border-gray-100">
        <h2 class="text-lg font-bold text-purple-dark mb-4">
              <font-awesome-icon icon="fas fa-filter" class="mr-2 text-purple-dark" /> Filtro de búsqueda
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            <div class="relative w-full">
                <input 
                    type="text" 
                    v-model="busquedaTexto" 
                    placeholder="Buscar por Urna, Servicio o palabra clave..."
                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none transition duration-150"
                    @keyup.enter="ejecutarBusquedaCompleta"
                />
                <font-awesome-icon icon="fas fa-search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select 
                v-model="filtroTipo"
                class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none bg-white transition duration-150"
            >
                <option value="todos" hidden>Categoría</option> 
                <option value="Servicio">Solo Servicios de Cremación</option>
                <option value="Urna">Solo Urnas</option>
                <option value="Accesorio">Solo Accesorios</option>
            </select>

            <select 
                v-model="filtroPrecio"
                class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-deep focus:ring-1 focus:ring-purple-deep focus:outline-none bg-white transition duration-150"
            >
                <option value="todos" hidden>Precio</option>
                <option value="bajo">Menos de $50.000</option>
                <option value="medio">$50.000 - $100.000</option>
                <option value="alto">Más de $100.000</option>
            </select>
            
            <button 
                @click="ejecutarBusquedaCompleta" 
                class="w-full bg-purple-deep text-white py-3 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md flex items-center justify-center space-x-2"
            >
                <font-awesome-icon icon="fas fa-search" />
                <span>Buscar</span>
            </button>
        </div>
      </div>
    </div>


    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-4 border-b-2 border-gray-300 pb-2">
            <h2 class="text-2xl font-bold text-purple-dark">
                <font-awesome-icon icon="fas fa-heart" class="mr-2 text-red-500" /> Servicios de Cremación
            </h2>
            <router-link to="/admin/inventario">
                <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md whitespace-nowrap">
                    Ver Inventario
                </button>
            </router-link>
        </div>
        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            <div 
                v-for="servicio in serviciosFiltrados" 
                :key="servicio.id" 
                class="bg-purple-card p-6 rounded-lg shadow-lg border-t-4 border-purple-deep hover:shadow-xl transition duration-300 relative"
            >
                
                <div 
                    @click.stop="toggleMenu(servicio.id, 'servicio')"
                    class="absolute top-2 right-2 bg-dark-primary-blue text-white p-2 rounded-lg cursor-pointer hover:bg-opacity-90 transition duration-150"
                    title="Opciones de Gestión">
                    <font-awesome-icon icon="fas fa-ellipsis-v" class="text-lg" />
                </div>
                
                <div v-if="activeMenu === servicio.id && activeMenuType === 'servicio'"
                    v-click-outside="closeMenuOnClickOutside"
                    class="absolute top-12 right-2 bg-white border border-gray-200 rounded-md shadow-lg z-30 w-32">
                    
                    <button @click.stop="verDetalleProducto(servicio)"
                            class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Ver Detalle</button>

                    <button @click.stop="simularEliminar(servicio)"
                            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">Eliminar</button>
                </div>


                <h2 class="text-xl font-bold mb-3 text-purple-dark mt-2">{{ servicio.nombre }}</h2>
                
                <div class="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500 font-sans overflow-hidden">
                    <img 
                        :src="servicio.imagenUrl || '/placeholder/producto.jpg'" 
                        :alt="`Imagen de ${servicio.nombre}`" 
                        class="w-full h-full object-cover"
                    >
                </div>
                
                <p class="text-xs font-bold text-purple-deep mb-1">{{ servicio.tipo.toUpperCase() }}</p>
                <p class="text-gray-600 mb-4 text-sm h-12 overflow-hidden">{{ servicio.descripcion }}</p>
                
                <p class="text-xl font-bold mb-4 text-gray-800">
                    Precio: ${{ servicio.precio.toLocaleString('es-CL') }} CLP
                </p>
                
                <button 
                    @click="iniciarReserva(servicio)"
                    class="w-full bg-purple-deep text-white py-2 rounded-md font-semibold hover:bg-purple-light transition duration-150"
                >
                    <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2" /> Seleccionar Servicio
                </button>
            </div>
            <p v-if="serviciosFiltrados.length === 0 && (busquedaTexto || filtroTipo !== 'todos' || filtroPrecio !== 'todos')" class="text-gray-500">No se encontraron servicios de cremación con estos criterios.</p>
        </section>

        <div class="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-2">
            <h2 class="text-2xl font-bold text-purple-dark">
                <font-awesome-icon icon="fas fa-box" class="mr-2 text-purple-dark" /> Urnas y Accesorios Disponibles
            </h2>
            <router-link to="/admin/inventario">
                <button class="bg-purple-deep text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md whitespace-nowrap">
                    Ver Inventario
                </button>
            </router-link>
        </div>
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            <div 
                v-for="item in accesoriosFiltrados" 
                :key="item.id" 
                class="bg-white-subtle p-5 rounded-lg shadow-md border-t-4 border-purple-deep hover:shadow-xl transition duration-300 relative"
            >
                
                <div 
                    @click.stop="toggleMenu(item.id, 'accesorio')"
                    class="absolute top-2 right-2 bg-dark-primary-blue text-white p-2 rounded-lg cursor-pointer hover:bg-opacity-90 transition duration-150"
                    title="Opciones de Gestión">
                    <font-awesome-icon icon="fas fa-ellipsis-v" class="text-base" />
                </div>
                
                <div v-if="activeMenu === item.id && activeMenuType === 'accesorio'"
                    v-click-outside="closeMenuOnClickOutside"
                    class="absolute top-10 right-2 bg-white border border-gray-200 rounded-md shadow-lg z-30 w-32">
                    
                    <button @click.stop="verDetalleProducto(item)"
                            class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm">Ver Detalle</button>

                    <button @click.stop="simularEliminar(item)"
                            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">Eliminar</button>
                </div>


                <h3 class="text-lg font-semibold mb-2 text-purple-dark">{{ item.nombre }}</h3>
                <p class="text-xs font-bold text-purple-deep mb-1">{{ item.tipo.toUpperCase() }}</p>
                
                <div class="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-500 text-sm overflow-hidden">
                    <img 
                        :src="item.imagenUrl || '/placeholder/producto.jpg'" 
                        :alt="`Imagen de ${item.nombre}`" 
                        class="w-full h-full object-cover"
                    >
                </div>

                <p class="text-sm font-bold mb-4 text-dark-primary-blue">
                    Precio: ${{ item.precio.toLocaleString('es-CL') }} CLP
                </p>
                
                <button 
                    @click="iniciarReserva(item)"
                    class="w-full bg-purple-deep text-white py-2 rounded-md font-semibold hover:bg-purple-light transition duration-150"
                >
                    <font-awesome-icon icon="fas fa-shopping-cart" class="mr-2" /> Añadir al Pedido
                </button>
            </div>
            
            <p v-if="accesoriosFiltrados.length === 0 && (busquedaTexto || filtroTipo !== 'todos' || filtroPrecio !== 'todos')" class="text-gray-500 mt-4">No se encontraron productos con estos criterios.</p>
        </section>

        <div class="mt-16 max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-dark-primary-blue border-b-2 border-gray-300 pb-2">
                <font-awesome-icon icon="fas fa-question-circle" class="mr-2 text-gray-500" /> Preguntas Frecuentes (FAQ)
            </h2>
            
            <div class="space-y-4">
                <details class="bg-purple-card p-4 rounded-lg shadow-md border-l-4 border-purple-deep cursor-pointer">
                    <summary class="font-semibold text-dark-primary-blue">¿El Plan Económico incluye la devolución de cenizas?</summary>
                    <p class="mt-2 text-gray-600 text-sm">No, el Servicio Económico es un proceso colectivo digno que no incluye la recuperación individual de cenizas ni la entrega de urna. Es una opción de despedida de bajo costo.</p>
                </details>
                <details class="bg-purple-card p-4 rounded-lg shadow-md border-l-4 border-purple-deep cursor-pointer">
                    <summary class="font-semibold text-dark-primary-blue">¿Cómo funciona la trazabilidad?</summary>
                    <p class="mt-2 text-gray-600 text-sm">Al contratar el Plan Premium, le asignamos un código único. Usted puede rastrear el estado de su servicio en línea, garantizando que los restos coincidan con la urna final.</p>
                </details>
                <details class="bg-white-subtle p-4 rounded-lg shadow-md border-l-4 border-purple-deep cursor-pointer">
                    <summary class="font-semibold text-dark-primary-blue">¿Qué hago en caso de emergencia fuera de horario?</summary>
                    <p class="mt-2 text-gray-600 text-sm">Nuestras instalaciones están disponibles de 09:00 a 18:00 hrs. Sin embargo, para **emergencias** (fallecimiento fuera de horario), puede contactarnos inmediatamente al número de WhatsApp flotante (24/7).</p>
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
import { faEllipsisV, faPlusCircle, faSearch, faShoppingCart, faHeart, faBox, faQuestionCircle, faFilter } from '@fortawesome/free-solid-svg-icons';

library.add(faEllipsisV, faPlusCircle, faSearch, faShoppingCart, faHeart, faBox, faQuestionCircle, faFilter); 

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


// --- ARRAYS DE DATOS ---

const servicios: Ref<Product[]> = ref([
    { id: 'S003', nombre: 'Servicio Premium', tipo: 'Servicio', precio: 165000, 
      descripcion: 'INCLUYE: Trazabilidad, Recogida a domicilio, Urna personalizable y Certificado.', 
      requierePersonalizacion: true,
      imagenUrl: '/servicios/premium.jpg' 
    }, 
    { id: 'S002', nombre: 'Servicio Estándar', tipo: 'Servicio', precio: 95000, 
      descripcion: 'INCLUYE: Servicio de cremación y opción de elegir una urna personalizable.', 
      requierePersonalizacion: true,
      imagenUrl: '/servicios/estandar.jpg' 
    },
    { id: 'S001', nombre: 'Servicio Económico', tipo: 'Servicio', precio: 40000, 
      descripcion: 'INCLUYE: Proceso colectivo y certificado. No incluye urna ni recuperación de cenizas.', 
      requierePersonalizacion: false,
      imagenUrl: '/servicios/economico.jpg' 
    }, 
] as Product[]);

const productosAccesoriosRaw: Ref<Product[]> = ref([
    { id: 'U001', nombre: 'Urna de Mármol "Eternidad"', tipo: 'Urna', precio: 85000, descripcion: 'Urna de mármol elegante y solemne para un recuerdo duradero.', requierePersonalizacion: true, imagenUrl: '/71zmEWBSB6L._AC_UF894,1000_QL80_.jpg' },
    { id: 'U002', nombre: 'Urna de Madera "Paz"', tipo: 'Urna', precio: 50000, descripcion: 'Urna de madera noble, sobria y cálida.', requierePersonalizacion: true, imagenUrl: '/urnas/urna_madera.jpg' },
    { id: 'U003', nombre: 'Urna "Siembra Vida"', tipo: 'Urna', precio: 60000, descripcion: 'Urna ecológica diseñada para plantar un árbol en memoria de tu mascota.', requierePersonalizacion: true, imagenUrl: '/urnas/urna_siembra.jpg' },
    { id: 'U004', nombre: 'Urna Metálica "Guardián"', tipo: 'Urna', precio: 45000, descripcion: 'Urna metálica resistente y moderna.', requierePersonalizacion: true, imagenUrl: '/urnas/urna_metalica.jpg' },
    { id: 'U005', nombre: 'Urna Cobre "Luminiscente"', tipo: 'Urna', precio: 90000, descripcion: 'Urna de cobre con un acabado brillante y distintivo.', requierePersonalizacion: true, imagenUrl: '/urnas/urna_cobre.jpg' }, 
    { id: 'A001', nombre: 'Grabado Láser (Adicional)', tipo: 'Accesorio', precio: 15000, descripcion: 'Grabado de nombre, fecha o mensaje corto.', requierePersonalizacion: true, imagenUrl: '/accesorios/grabado_laser.jpg' },
    { id: 'A002', nombre: 'Cofre de Huella', tipo: 'Accesorio', precio: 25000, descripcion: 'Un recuerdo tierno para conservar la huella de tu mascota.', requierePersonalizacion: false, imagenUrl: '/accesorios/cofre_huella.jpg' }
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
        
        const tipoDeseado = filtroTipoEjecutado.value;
        const coincideTipo = tipoDeseado === 'todos' || item.tipo === tipoDeseado || (item.tipo === 'Servicio Extra' && tipoDeseado === 'Servicio');

        const coincidePrecio = aplicarFiltroPrecio(item.precio, filtroPrecioEjecutado.value);

        const coincideTexto = !textoMinuscula || 
                              item.nombre.toLowerCase().includes(textoMinuscula) || 
                              item.descripcion.toLowerCase().includes(textoMinuscula);

        return coincideTipo && coincidePrecio && coincideTexto;
    });
};

const serviciosFiltrados = computed(() => {
    return filtrarItems(servicios.value);
});

const accesoriosFiltrados = computed(() => {
    const items = productosAccesoriosRaw.value.filter(item => item.tipo !== 'Servicio');
    return filtrarItems(items);
});


// --- LÓGICA DE MENÚ Y ACCIÓN ---

const closeMenuOnClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (activeMenu.value && !target.closest('.absolute.top-12') && !target.closest('.absolute.top-10') && !target.closest('[title="Opciones de Gestión"]')) {
        activeMenu.value = null;
        activeMenuType.value = null;
    }
};

onMounted(() => {
    window.addEventListener('click', closeMenuOnClickOutside);
    ejecutarBusquedaCompleta(); // Muestra todos los productos al cargar
});

onUnmounted(() => {
    window.removeEventListener('click', closeMenuOnClickOutside);
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


const verDetalleProducto = (producto: Product) => {
    sessionStorage.setItem('detalle_producto', JSON.stringify(producto));
    activeMenu.value = null; 
    activeMenuType.value = null;
    router.push('/detalle-producto'); 
};

const simularEliminar = (producto: Product) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
        console.log(`Ítem ${producto.nombre} eliminado (Simulación).`);
    }
    activeMenu.value = null; 
    activeMenuType.value = null;
};

const iniciarReserva = (producto: Product) => {
    sessionStorage.setItem('producto_reserva', JSON.stringify(producto));
    console.log(`Producto ${producto.nombre} añadido al pedido.`);
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
    background-color: #5C2A72; 
}
.text-purple-deep {
    color: #5C2A72; 
}
.border-purple-deep {
    border-color: #5C2A72; 
}
.bg-purple-card {
    background-color: #F8F4FA; /* Tono de tarjeta con tinte púrpura */
}

/* 2. DEFINICIONES DE COLORES DE ACCIÓN */
.bg-cyan-700 { background-color: #17a2b8; }
.text-cyan-700 { color: #17a2b8; }
.bg-cyan-800 { background-color: #0f869a; }
.bg-whatsapp { background-color: #25d366; }

/* 3. GRIS CARBÓN (Mantenido para Footer/Texto) */
.bg-dark-primary-blue { background-color: #34495e; }
.text-dark-primary-blue { color: #34495e; }

/* 4. FONDOS DE TARJETA */
.bg-white-subtle { background-color: #F8F4FA; }

/* 5. DORADO (Para texto de acento) */
.text-bd-gold-accent { color: #FFC107; }

/* CLASE CRUCIAL: Definición de la imagen de fondo */
.hero-background {
    background-image: url('/photo-1544568100-847a948585b9.jpg');
}
</style>