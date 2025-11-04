import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. IMPORTACIONES DE ÍCONOS SÓLIDOS (fas)
import { 
    // Íconos de Tienda/Gestión
    faShoppingCart, faMoneyCheckAlt, faCreditCard,
    faPencilAlt, faSave, faPlusCircle, faPlus, faTrash, faTimes, faTimesCircle, faCheckCircle, 
    // Íconos de Navegación y Administración 
    faHome, faInfoCircle, faBuilding, faCross, faRoute, faBars, 
    faChartLine, faBook, faFileAlt, faEllipsisV, faSearch, faMapMarkerAlt, faPhone, faEnvelope,
    // Usuario/Contacto
    faUser, faUserEdit, faSignOutAlt, 
    faPhoneAlt, faEnvelope as faEnvelopeSolid // Renombrado para evitar conflicto con faEnvelope de solid
} from '@fortawesome/free-solid-svg-icons' 

// 2. IMPORTACIONES DE ÍCONOS DE MARCA (fab)
import { 
    faWhatsapp,
    faCcVisa,
    faCcMastercard,
    faPaypal,
    faFacebookF, 
    faInstagram 
} from '@fortawesome/free-brands-svg-icons' 
import { defineNuxtPlugin } from 'nuxt/app'


// 3. AÑADIR TODOS A LA LIBRERÍA
library.add(
    // Tienda/Gestión
    faShoppingCart, faMoneyCheckAlt, faCreditCard,
    faPencilAlt, faSave, faPlusCircle, faPlus, faTrash, faTimes, faTimesCircle, faCheckCircle, faEllipsisV,
    // Navegación/Administración/Contacto
    faHome, faInfoCircle, faBuilding, faCross, faRoute, faBars, 
    faChartLine, faBook, faFileAlt, faSearch, faMapMarkerAlt, faPhone,
    // Usuario/Contacto
    faUser, faUserEdit, faSignOutAlt, faPhoneAlt, faEnvelopeSolid,
    // Marcas/Social
    faWhatsapp, faCcVisa, faCcMastercard, faPaypal, faFacebookF, faInstagram
)

// Registramos el componente de ícono globalmente
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})