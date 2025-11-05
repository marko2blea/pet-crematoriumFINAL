// Archivo: /plugins/fontawesome.ts

/// <reference types="~~/types/plugins" /> // FIX: Asegura que TypeScript reconozca defineNuxtPlugin

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. IMPORTACIONES DE ÍCONOS SÓLIDOS (fas)
// Incluye todos los íconos usados en el layout y las páginas de tu proyecto.
import { 
    faShoppingCart, faMoneyCheckAlt, faCreditCard,
    faPencilAlt, faSave, faPlusCircle, faPlus, faTrash, faTimes, faTimesCircle, faCheckCircle, 
    faSearch, faMapMarkerAlt, faHome, faInfoCircle, faBuilding, faCross, faRoute, 
    faChartLine, faBook, faFileAlt, faEllipsisV, faUser, faUserEdit, faSignOutAlt, 
    faPhone, faEnvelope, faBars, faPhoneAlt
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


// 3. AÑADIR TODOS A LA LIBRERÍA
library.add(
    // Íconos Sólidos
    faShoppingCart, faMoneyCheckAlt, faCreditCard,
    faPencilAlt, faSave, faPlusCircle, faPlus, faTrash, faTimes, faTimesCircle, faCheckCircle, 
    faSearch, faMapMarkerAlt, faHome, faInfoCircle, faBuilding, faCross, faRoute, 
    faChartLine, faBook, faFileAlt, faEllipsisV, faUser, faUserEdit, faSignOutAlt, 
    faPhone, faEnvelope, faBars, faPhoneAlt,
    // Íconos de Marca
    faWhatsapp, faCcVisa, faCcMastercard, faPaypal, faFacebookF, faInstagram
)

// Registramos el componente de ícono globalmente
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})