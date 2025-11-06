<template>
  <div class="min-h-screen flex flex-col font-sans main-background">
    
    <header class="bg-bd-purple-dark shadow-lg py-2 fixed top-0 left-0 right-0 z-50">
      <div class="container mx-auto px-4 flex justify-between items-center text-white">
        
        <div class="flex items-center space-x-4 flex-shrink-0 h-full">
            <NuxtLink to="/" class="flex items-center p-2 bg-white rounded-lg shadow-md">
                <img src="/logo2.png" alt="Crematorio San Antonio Logo" class="h-10">
            </NuxtLink>
        </div>

        <div class="hidden lg:flex items-center space-x-3 justify-center mx-4"> 
          
          <NuxtLink to="/" :class="isActive('/')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-home" class="text-white" /><span>Inicio</span>
          </NuxtLink>
          <NuxtLink to="/about" :class="isActive('/about')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-info-circle" class="text-white" /><span>Nosotros</span>
          </NuxtLink>
          <NuxtLink to="/instalaciones" :class="isActive('/instalaciones')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-building" class="text-white" /><span>Instalaciones</span>
          </NuxtLink>
          <NuxtLink to="/memorial" :class="isActive('/memorial')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrapw-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-cross" class="text-white" /><span>Memorial</span>
          </NuxtLink>
          <NuxtLink to="/tracking" :class="isActive('/tracking')" class="text-white py-2 px-3 rounded-lg font-medium hover:bg-bd-purple-dark-hover transition duration-150 flex-shrink-0 text-center whitespace-nowrap w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-route" class="text-white" /><span>Seguimiento</span>
          </NuxtLink>
          
          <NuxtLink to="/admin/dashboard" :class="isActive('/admin/dashboard', true)" class="bg-white text-bd-purple-dark py-2 px-3 rounded-lg font-bold hover:bg-gray-100 transition duration-150 border-2 border-white flex-shrink-0 text-center whitespace-nowrap shadow-md w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-chart-line" class="text-bd-purple-dark" /><span>Dashboard</span>
          </NuxtLink>
          <NuxtLink to="/admin/reservas" :class="isActive('/admin/reservas', true)" class="bg-white text-bd-purple-dark py-2 px-3 rounded-lg font-bold hover:bg-gray-100 transition duration-150 border-2 border-white flex-shrink-0 text-center whitespace-nowrap shadow-md w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-book" class="text-bd-purple-dark" /><span>Reservas</span>
          </NuxtLink>
          <NuxtLink to="/admin/reportes" :class="isActive('/admin/reportes', true)" class="bg-white text-bd-purple-dark py-2 px-3 rounded-lg font-bold hover:bg-gray-100 transition duration-150 border-2 border-white flex-shrink-0 text-center whitespace-nowrap shadow-md w-36 flex items-center space-x-2 justify-center">
            <font-awesome-icon icon="fas fa-file-alt" class="text-bd-purple-dark" /><span>Reportes</span>
          </NuxtLink>
        </div>

        <nav class="flex items-center space-x-4 flex-shrink-0">
          
          <NuxtLink to="/carrito" title="Carrito de Compras" class="text-white hover:text-gray-200 transition duration-150">
                <font-awesome-icon icon="fas fa-shopping-cart" class="text-xl" />
            </NuxtLink>
          
          <div class="relative">
            <button @click="toggleMenu" class="text-white hover:text-gray-200 transition duration-150 p-2 rounded-full hover:bg-bd-purple-dark-hover" title="Opciones de Usuario">
                <font-awesome-icon icon="fas fa-user" class="text-xl" />
            </button>
            <div v-if="isMenuOpen" 
              class="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
              
              <NuxtLink to="/editar-cuenta" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 transition duration-100 text-sm">
                <font-awesome-icon icon="fas fa-user-edit" class="mr-2 text-bd-gold-accent" />Editar Cuenta</NuxtLink>
              
              <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-100 text-sm text-red-600 border-t border-gray-200">
                <font-awesome-icon icon="fas fa-sign-out-alt" class="mr-2" />Cerrar Sesión</button>
            </div>
          </div>
          
          <NuxtLink to="/login" class="bg-white text-bd-purple-dark py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition duration-150 flex-shrink-0 shadow-md">
            Iniciar sesión 
          </NuxtLink>
          
        </nav>
      </div>
    </header>

    <main class="flex-grow pt-14">
        <slot /> 
    </main>
    
    <footer class="bg-purple-deep text-white p-10 mt-auto shadow-2xl border-t-4 border-bd-gold-accent">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8">
        
        <div class="md:w-1/4 space-y-3">
          <p class="text-xl font-bold mb-3 text-bd-gold-accent">Contacto & Trazabilidad</p>
          <div class="text-sm space-y-3">
            <p class="flex items-center">
              <font-awesome-icon icon="fas fa-phone-alt" class="mr-3 text-bd-gold-accent w-4" /> 
              Teléfono: <a href="tel:+5693428591" class="ml-2 hover:underline">+56 (9) 3428591</a>
            </p>
            <p class="flex items-center">
              <font-awesome-icon icon="fas fa-envelope" class="mr-3 text-bd-gold-accent w-4" /> 
              Email: <a href="mailto:contacto@crematoriosanantonio.cl" class="ml-2 hover:underline">contacto@crematoriosanantonio.cl</a>
            </p>
          </div>
          <NuxtLink to="/tracking" class="mt-4 inline-block bg-bd-purple-light text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-bd-purple-dark-hover transition shadow-md">
            Rastrear Servicio ➡️
          </NuxtLink>
        </div>
        
        <div class="md:w-1/4 space-y-4">
            <p class="text-xl font-bold mb-3 text-bd-gold-accent">Métodos de Pago</p>
            <div class="flex flex-wrap gap-3 text-4xl text-gray-300">
                <font-awesome-icon icon="fab fa-cc-visa" title="Visa" class="hover:text-white transition" />
                <font-awesome-icon icon="fab fa-cc-mastercard" title="Mastercard" class="hover:text-white transition" />
                <font-awesome-icon icon="fas fa-money-check-alt" title="Transferencia" class="hover:text-white transition" />
            </div>
            <p class="text-sm text-white pt-2">Aceptamos transferencias y tarjetas de crédito principales.</p>
        </div>

        <div class="md:w-1/4 space-y-4 text-center md:text-left">
            <p class="text-xl font-bold mb-3 text-bd-gold-accent">Comunidad</p>
            <div class="flex justify-center md:justify-start space-x-6 text-4xl">
                <a href="#" class="text-gray-300 hover:text-bd-gold-accent transition duration-200" title="Síguenos en Facebook">
                    <font-awesome-icon icon="fab fa-facebook-f" />
                </a> 
                <a href="#" class="text-gray-300 hover:text-bd-gold-accent transition duration-200" title="Síguenos en Instagram">
                    <font-awesome-icon icon="fab fa-instagram" />
                </a> 
            </div>
        </div>
        
        <div class="md:w-1/4 space-y-3 text-right">
            <p class="text-xs font-semibold text-white">Horario de Oficina:</p>
            <p class="text-sm font-medium">Lun - Sáb: 09:00 a 18:00 hrs.</p>
            <p class="text-sm text-red-400 font-bold">Emergencias 24/7</p>
            <hr class="border-gray-700 mt-4">
            <p class="text-xs text-white mt-2">&copy; 2025 Crematorio San Antonio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <section class="fixed bottom-0 left-0 right-0 z-40 bg-bd-purple-dark text-white text-center py-1.5 shadow-2xl">
      <p class="text-sm font-medium">Horario: Lunes a Sábado | 09:00 a 18:00 hrs. • Dirección: Tomé, Región del Biobío (Emergencias 24/7)</p>
    </section>
    
    <a href="#" 
      title="Contacto Rápido"
      class="fixed bottom-16 right-6 z-50 bg-whatsapp text-white p-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
        <font-awesome-icon icon="fab fa-whatsapp" class="text-3xl" />
    </a>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'; 
import { useRoute } from 'vue-router';
// Importamos la librería para añadir los iconos al componente
import { library } from '@fortawesome/fontawesome-svg-core';
// Importamos las constantes de TODOS los íconos solid (incluyendo carrito y usuario)
import { faShoppingCart, faUser, faUserEdit, faSignOutAlt, faPhoneAlt, faEnvelope, faBars, faHome, faInfoCircle, faBuilding, faCross, faRoute, faChartLine, faBook, faFileAlt, faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';
// Importamos las constantes de TODOS los íconos brands
import { faWhatsapp, faCcVisa, faCcMastercard, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'; 

// 1. CORRECCIÓN CLAVE: Añadir TODOS los íconos usados en el Layout a la librería del componente
library.add(faShoppingCart, faUser, faUserEdit, faSignOutAlt, faPhoneAlt, faEnvelope, faBars, faWhatsapp, faCcVisa, faCcMastercard, faFacebookF, faInstagram, faHome, faInfoCircle, faBuilding, faCross, faRoute, faChartLine, faBook, faFileAlt, faMoneyCheckAlt);


const route = useRoute();
const isMenuOpen = ref(false); 

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; }; 
const closeMenu = () => { isMenuOpen.value = false; }; 
const logout = () => { 
    alert("Simulación: Cerrando sesión..."); 
    isMenuOpen.value = false; 
};

// Lógica de clase activa (Se mantiene)
const isActive = (path: string, isAdminLink: boolean = false): string => {
    const currentPath = route.path;
    const isRootHome = path === '/' && currentPath === '/';
    const isSubRouteActive = path !== '/' && currentPath.startsWith(path);
    const isActiveLink = isRootHome || isSubRouteActive;
    
    // Clase para alinear el icono y el texto (Ya está incluida en el retorno)
    const alignmentClasses = 'flex items-center space-x-2 justify-center w-36';
    
    if (isActiveLink) {
        if (isAdminLink) {
            // Enlaces de administración activos (fondo blanco, texto MORADO)
            return `bg-gray-200 border-b-4 border-bd-purple-dark text-bd-purple-dark ${alignmentClasses}`;
        }
        // Enlaces de navegación principal activos (fondo morado-hover, texto BLANCO)
        return `bg-bd-purple-dark-hover border-b-4 border-bd-gold-accent text-white ${alignmentClasses}`; 
    }
    // Si no está activo
    if (isAdminLink) {
        // Enlaces de administración inactivos (fondo blanco, texto MORADO)
        return `bg-white text-bd-purple-dark ${alignmentClasses}`;
    }
    // Enlaces de navegación principal inactivos (fondo morado, texto BLANCO)
    return `text-white ${alignmentClasses}`; 
};
</script>

<style scoped>
/*
|--------------------------------------------------------------------------
| 💜 PALETA DE COLORES PERSONALIZADA (BD PURPLE & GOLD)
|--------------------------------------------------------------------------
*/

/* MORADO OSCURO (bd-purple-dark) - Color Principal */
.bg-bd-purple-dark { background-color: #4A148C; } 
.text-bd-purple-dark { color: #4A148C; }

/* MORADO CLARO/BRILLANTE (bd-purple-light) - Color de Botones de Acción */
.bg-bd-purple-light { background-color: #AB47BC; } 
.text-bd-purple-light { color: #AB47BC; }
.border-bd-purple-light { border-color: #AB47BC; }

.bg-purple-deep {
    background-color: #5C2A72; 
}
.bg-purple-light {
    background-color: #6C3483; 
}
.text-bd-gold-accent { 
    color: #FFD700,
}

/* MORADO OSCURO DE HOVER (bd-purple-dark-hover) - Efecto hover de la navegación */
.bg-bd-purple-dark-hover { background-color: #6A1B9A; } 


/* DORADO/OCRE (bd-gold-accent) - Color de Acento (Bordes Activos y Footer) */
.bg-bd-gold-accent { background-color: #FFC107; } 
.text-bd-gold-accent { color: #FFC107; }
.border-bd-gold-accent { border-color: #FFC107; }


/* OTROS COLORES */
.bg-dark-gray { background-color: #34495e; } /* Fondo del footer (Oscuro) */
.bg-whatsapp { background-color: #25d366; } /* Color de WhatsApp (Verde) */

/* Estilo para el Logo (Borde blanco en fondo púrpura) */
.logo-border {
    border: 3px solid white;
    border-radius: 6px; 
    padding: 2px;
    background-color: white; 
}
</style>