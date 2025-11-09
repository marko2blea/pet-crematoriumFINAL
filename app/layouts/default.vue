<template>
  <div class="min-h-screen flex flex-col font-sans main-background">
    
    <!-- ===== HEADER ===== -->
    <header class="bg-bd-purple-dark shadow-lg py-2 fixed top-0 left-0 right-0 z-50">
      <div class="container mx-auto px-4 flex justify-between items-center text-white h-14">
        
        <!-- Logo (sin cambios) -->
        <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center p-2 bg-white rounded-lg shadow-md">
                <img src="/logo2.png" alt="Crematorio San Antonio Logo" class="h-10">
            </NuxtLink>
        </div>

        <!-- (ACTUALIZADO) Navegación Principal (Desktop) -->
        <!-- Oculta en 'lg' y se mueve al menú lateral -->
        <div class="hidden lg:flex items-center space-x-1 justify-center mx-auto px-4"> 
          
          <NuxtLink to="/" :class="isActive('/')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-32 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-home" /><span>Inicio</span>
          </NuxtLink>
          <NuxtLink to="/about" :class="isActive('/about')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-32 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-info-circle" /><span>Nosotros</span>
          </NuxtLink>
          <NuxtLink to="/instalaciones" :class="isActive('/instalaciones')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-32 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-building" /><span>Instalaciones</span>
          </NuxtLink>
          <NuxtLink to="/memorial" :class="isActive('/memorial')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-32 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-cross" /><span>Memorial</span>
          </NuxtLink>
          <NuxtLink to="/tracking" :class="isActive('/tracking')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-32 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-route" /><span>Seguimiento</span>
          </NuxtLink>
          
          <!-- Enlaces de Admin (Solo si el rol es Admin) -->
          <template v-if="user && user.id_rol !== 1">
            <NuxtLink to="/admin/dashboard" :class="isActive('/admin/dashboard', true)" class="bg-white text-bd-purple-dark py-2 px-3 rounded-lg font-bold hover:bg-gray-100 transition duration-150 border-2 border-white flex-shrink-0 text-center whitespace-nowrap shadow-md w-32 flex items-center space-x-2 justify-center">
              <font-awesome-icon icon="fas fa-chart-line" /><span>Dashboard</span>
            </NuxtLink>
            <NuxtLink to="/admin/reservas" :class="isActive('/admin/reservas', true)" class="bg-white text-bd-purple-dark py-2 px-3 rounded-lg font-bold hover:bg-gray-100 transition duration-150 border-2 border-white flex-shrink-0 text-center whitespace-nowrap shadow-md w-32 flex items-center space-x-2 justify-center">
              <font-awesome-icon icon="fas fa-book" /><span>Reservas</span>
            </NuxtLink>
          </template>
        </div>

        <!-- Acciones Derecha: Carrito, Login/Usuario y Menú Móvil -->
        <nav class="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          
          <!-- Botón de Carrito con Contador (Visible en todos los tamaños) -->
          <NuxtLink to="/carrito" title="Carrito de Compras" class="text-white hover:text-gray-200 transition duration-150 relative p-2">
              <font-awesome-icon icon="fas fa-shopping-cart" class="text-xl" />
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-bd-purple-dark">
                {{ cartCount }}
              </span>
          </NuxtLink>
          
          <!-- Lógica v-if / v-else para Sesión (Visible en LG y más) -->
          
          <!-- v-if: No hay usuario (Botón Iniciar Sesión) -->
          <NuxtLink v-if="!user" to="/login" class="hidden lg:flex bg-white text-bd-purple-dark py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition duration-150 flex-shrink-0 shadow-md">
            Iniciar sesión 
          </NuxtLink>

          <!-- v-else: Sí hay usuario (Menú Desplegable) -->
          <div v-else class="relative hidden lg:block">
            <button @click="toggleMenu" class="flex items-center space-x-2 text-white hover:text-gray-200 transition duration-150 p-2 rounded-lg hover:bg-bd-purple-dark-hover" title="Opciones de Usuario">
                <font-awesome-icon icon="fas fa-user" class="text-xl" />
                <div class="flex flex-col items-start">
                  <span class="text-sm font-bold leading-none">Hola, {{ user.nombre || 'Usuario' }}</span>
                  <span class="text-xs text-green-400 font-semibold leading-none flex items-center">
                    <span class="h-2 w-2 bg-green-400 rounded-full mr-1.5"></span>
                    Conectado
                  </span>
                </div>
            </button>
            
            <div v-if="isMenuOpen" 
                 class="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
              <div class="p-4 border-b border-gray-200 bg-gray-50">
                <p class="font-bold text-purple-dark truncate">{{ user.nombre }} {{ user.apellido_paterno }}</p>
                <p class="text-xs text-gray-600 truncate">{{ user.correo }}</p>
              </div>
              <NuxtLink to="/editar-cuenta" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 transition duration-100 text-sm">
                <font-awesome-icon icon="fas fa-user-edit" class="mr-2 text-bd-gold-accent" />Editar Mi Cuenta
              </NuxtLink>
              <NuxtLink v-if="user.id_rol !== 1" to="/admin/gestionar-usuario" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 transition duration-100 text-sm">
                <font-awesome-icon icon="fas fa-users-cog" class="mr-2 text-bd-purple-dark" />Gestionar Usuarios
              </NuxtLink>
              <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-100 text-sm text-red-600 border-t border-gray-200">
                <font-awesome-icon icon="fas fa-sign-out-alt" class="mr-2" />Cerrar Sesión
              </button>
            </div>
          </div>
          
          <!-- (NUEVO) Botón de Hamburguesa (Visible solo en 'lg' e inferiores) -->
          <button @click="isMobileMenuOpen = true" class="lg:hidden text-white p-2">
            <font-awesome-icon icon="fas fa-bars" class="text-2xl" />
          </button>

        </nav>
      </div>
    </header>

    <!-- ===== (NUEVO) MENÚ LATERAL MÓVIL ===== -->
    <div v-if="isMobileMenuOpen" class="lg:hidden fixed inset-0 z-[100]">
      <!-- Overlay Oscuro -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="isMobileMenuOpen = false"></div>
      
      <!-- Contenido del Menú -->
      <div class="fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-white text-gray-800 shadow-2xl flex flex-col">
        
        <!-- Encabezado del Menú (Logo y Cerrar) -->
        <div class="flex justify-between items-center p-4 border-b">
          <img src="/logo2.png" alt="Logo" class="h-10">
          <button @click="isMobileMenuOpen = false" class="p-2 text-gray-500">
            <font-awesome-icon icon="fas fa-times" class="text-2xl" />
          </button>
        </div>
        
        <!-- Contenido principal del menú (Scrollable) -->
        <div class="flex-grow overflow-y-auto">
          
          <!-- Saludo (si está logueado) -->
          <div v-if="user" class="p-4 border-b bg-gray-50">
            <p class="font-bold text-purple-dark truncate">{{ user.nombre }} {{ user.apellido_paterno }}</p>
            <p class="text-xs text-gray-600 truncate">{{ user.correo }}</p>
          </div>

          <!-- Enlaces de Navegación -->
          <nav class="flex flex-col text-lg font-medium">
            <NuxtLink @click="isMobileMenuOpen = false" to="/" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-home" class="w-6 mr-3 text-purple-deep" />Inicio</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/about" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-info-circle" class="w-6 mr-3 text-purple-deep" />Nosotros</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/instalaciones" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-building" class="w-6 mr-3 text-purple-deep" />Instalaciones</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/memorial" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-cross" class="w-6 mr-3 text-purple-deep" />Memorial</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/tracking" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-route" class="w-6 mr-3 text-purple-deep" />Seguimiento</NuxtLink>
          </nav>
          
          <!-- Enlaces de Admin (si es admin) -->
          <template v-if="user && user.id_rol !== 1">
            <hr class="my-2">
            <p class="px-4 pt-2 text-xs font-semibold text-gray-400 uppercase">Administración</p>
            <nav class="flex flex-col text-lg font-medium">
              <NuxtLink @click="isMobileMenuOpen = false" to="/admin/dashboard" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-chart-line" class="w-6 mr-3 text-purple-deep" />Dashboard</NuxtLink>
              <NuxtLink @click="isMobileMenuOpen = false" to="/admin/reservas" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-book" class="w-6 mr-3 text-purple-deep" />Reservas</NuxtLink>
              <NuxtLink @click="isMobileMenuOpen = false" to="/admin/gestionar-usuario" class="px-4 py-3 hover:bg-gray-100 flex items-center"><font-awesome-icon icon="fas fa-users-cog" class="w-6 mr-3 text-purple-deep" />Usuarios</NuxtLink>
            </nav>
          </template>
        </div>

        <!-- Footer del Menú (Login/Logout) -->
        <div class="p-4 border-t">
          <NuxtLink v-if="!user" @click="isMobileMenuOpen = false" to="/login" class="block w-full text-center bg-purple-deep text-white py-3 rounded-lg font-bold hover:bg-purple-light transition duration-150 shadow-md">
            Iniciar Sesión
          </NuxtLink>
          <template v-else>
            <NuxtLink @click="isMobileMenuOpen = false" to="/editar-cuenta" class="block w-full text-center bg-gray-200 text-purple-dark py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-150 mb-2">
              <font-awesome-icon icon="fas fa-user-edit" class="mr-2" />Editar Cuenta
            </NuxtLink>
            <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-100 text-sm text-red-600 font-medium">
              <font-awesome-icon icon="fas fa-sign-out-alt" class="mr-2" />Cerrar Sesión
            </button>
          </template>
        </div>
      </div>
    </div>
    <!-- ===== FIN MENÚ MÓVIL ===== -->


    <!-- Contenido Principal -->
    <main class="flex-grow pt-14">
        <slot /> 
    </main>
    
    <!-- Footer (sin cambios) -->
    <footer class="bg-purple-deep text-white p-6 md:p-10 mt-auto shadow-2xl border-t-4 border-bd-gold-accent">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div class="space-y-3">
          <p class="text-xl font-bold mb-3 text-bd-gold-accent">Contacto & Trazabilidad</p>
          <div class="text-sm space-y-3">
            <p class="flex items-start">
              <font-awesome-icon icon="fas fa-phone-alt" class="mr-3 text-bd-gold-accent w-4 mt-1" /> 
              <span>Teléfono: <a href="tel:+5693428591" class="ml-1 hover:underline">+56 (9) 3428591</a></span>
            </p>
            <p class="flex items-start">
              <font-awesome-icon icon="fas fa-envelope" class="mr-3 text-bd-gold-accent w-4 mt-1" /> 
              <span>Email: <a href="mailto:contacto@crematoriosanantonio.cl" class="ml-1 hover:underline break-all">contacto@crematoriosanantonio.cl</a></span>
            </p>
          </div>
          <NuxtLink to="/tracking" class="mt-4 inline-block bg-bd-purple-light text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-bd-purple-dark-hover transition shadow-md">
            Rastrear Servicio ➡️
          </NuxtLink>
        </div>
        
        <div class="space-y-4">
            <p class="text-xl font-bold mb-3 text-bd-gold-accent">Métodos de Pago</p>
            <div class="flex flex-wrap gap-3 text-4xl text-gray-300">
                <font-awesome-icon icon="fab fa-cc-visa" title="Visa" class="hover:text-white transition" />
                <font-awesome-icon icon="fab fa-cc-mastercard" title="Mastercard" class="hover:text-white transition" />
                <font-awesome-icon icon="fas fa-money-check-alt" title="Transferencia" class="hover:text-white transition" />
            </div>
            <p class="text-sm text-white pt-2">Aceptamos transferencias y tarjetas de crédito principales.</p>
        </div>

        <div class="space-y-4">
            <p class="text-xl font-bold mb-3 text-bd-gold-accent">Comunidad</p>
            <div class="flex justify-start space-x-6 text-4xl">
                <a href="#" class="text-gray-300 hover:text-bd-gold-accent transition duration-200" title="Síguenos en Facebook">
                    <font-awesome-icon icon="fab fa-facebook-f" />
                </a> 
                <a href="#" class="text-gray-300 hover:text-bd-gold-accent transition duration-200" title="Síguenos en Instagram">
                    <font-awesome-icon icon="fab fa-instagram" />
                </a> 
            </div>
        </div>
        
        <div class="space-y-3 md:text-right">
            <p class="text-xs font-semibold text-white">Horario de Oficina:</p>
            <p class="text-sm font-medium">Lun - Sáb: 09:00 a 18:00 hrs.</p>
            <p class="text-sm text-red-400 font-bold">Emergencias 24/7</p>
            <hr class="border-gray-700 mt-4">
            <p class="text-xs text-white mt-2">&copy; 2025 Crematorio San Antonio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- Banner Fijo (Actualizado para ser responsivo) -->
    <section class="fixed bottom-0 left-0 right-0 z-40 bg-bd-purple-dark text-white text-center py-1.5 shadow-2xl px-4">
      <p class="text-xs sm:text-sm font-medium truncate">Horario: Lunes a Sábado | 09:00 a 18:00 hrs. • Emergencias 24/7</p>
    </section>
    
    <!-- WhatsApp (sin cambios) -->
    <a href="#" 
       title="Contacto Rápido"
       class="fixed bottom-16 right-6 z-50 bg-whatsapp text-white p-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
        <font-awesome-icon icon="fab fa-whatsapp" class="text-3xl" />
    </a>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; 
import { useRoute, useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
// (ACTUALIZADO) Añadir faBars y faTimes para el menú móvil
import { 
  faShoppingCart, faUser, faUserEdit, faSignOutAlt, faPhoneAlt, 
  faEnvelope, faBars, faHome, faInfoCircle, faBuilding, faCross, 
  faRoute, faChartLine, faBook, faFileAlt, faMoneyCheckAlt,
  faUsersCog, faTimes // <-- AÑADIDOS
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, faCcVisa, faCcMastercard, faFacebookF, faInstagram 
} from '@fortawesome/free-brands-svg-icons'; 

library.add(
  faShoppingCart, faUser, faUserEdit, faSignOutAlt, faPhoneAlt, 
  faEnvelope, faBars, faWhatsapp, faCcVisa, faCcMastercard, 
  faFacebookF, faInstagram, faHome, faInfoCircle, faBuilding, 
  faCross, faRoute, faChartLine, faBook, faFileAlt, faMoneyCheckAlt,
  faUsersCog, faTimes // <-- AÑADIDOS
);


const route = useRoute();
const router = useRouter(); 
const isMenuOpen = ref(false); 
const isMobileMenuOpen = ref(false); // (NUEVO) Estado para el menú móvil

// Lógica de Sesión y Carrito
const user = useUser();
const { cartCount, loadCart, clearCart } = useCart(); 

onMounted(() => {
  loadCart(); // Cargar carrito al iniciar
});

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; }; 
const closeMenu = () => { isMenuOpen.value = false; }; 

const logout = () => { 
    user.value = null; 
    clearCart();
    isMenuOpen.value = false; 
    isMobileMenuOpen.value = false; // (NUEVO) Cerrar también el menú móvil
    router.push('/');
};

// Lógica de clase activa (Desktop)
const isActive = (path: string, isAdminLink: boolean = false): string => {
  const currentPath = route.path;
  const isRootHome = path === '/' && currentPath === '/';
  const isSubRouteActive = path !== '/' && currentPath.startsWith(path);
  const isActiveLink = isRootHome || isSubRouteActive;
  
  // (ACTUALIZADO) Ancho reducido para que quepan más
  const alignmentClasses = 'flex items-center space-x-2 justify-center w-32';
  
  if (isActiveLink) {
      if (isAdminLink) {
          return `bg-gray-200 border-b-4 border-bd-purple-dark text-bd-purple-dark ${alignmentClasses}`;
      }
      return `bg-bd-purple-dark-hover border-b-4 border-bd-gold-accent text-white ${alignmentClasses}`; 
  }
  if (isAdminLink) {
      return `bg-white text-bd-purple-dark ${alignmentClasses}`;
  }
  return `text-white ${alignmentClasses}`; 
};
</script>

<style scoped>
/* PALETA DE COLORES (sin cambios) */
.bg-bd-purple-dark { background-color: #4A148C; } 
.text-bd-purple-dark { color: #4A148C; }
.bg-bd-purple-light { background-color: #AB47BC; } 
.text-bd-purple-light { color: #AB47BC; }
.border-bd-purple-light { border-color: #AB47BC; }
.bg-purple-deep { background-color: #5C2A72; }
.bg-purple-light { background-color: #6C3483; }
.text-bd-gold-accent { color: #FFD700; } /* Corregido: sin coma */
.bg-bd-purple-dark-hover { background-color: #6A1B9A; } 
.bg-bd-gold-accent { background-color: #FFC107; } 
.text-bd-gold-accent { color: #FFC107; }
.border-bd-gold-accent { border-color: #FFC107; }
.bg-dark-gray { background-color: #34495e; }
.bg-whatsapp { background-color: #25d366; } 
.logo-border {
    border: 3px solid white;
    border-radius: 6px; 
    padding: 2px;
    background-color: white; 
}
.text-green-400 { color: #4ade80; }
</style>