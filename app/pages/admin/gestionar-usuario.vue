<template>
  <div class="min-h-screen bg-bd-light-purple p-4 sm:p-8 pt-20">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-extrabold text-bd-purple-dark mb-8 border-b-4 pb-2 border-bd-gold-accent tracking-tight">
        Gestión de Usuarios y Roles
      </h1>

      <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
        
        <!-- Controles de Filtrado y Búsqueda -->
        <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <!-- Filtro por Rol (Tabs) -->
          <div class="flex space-x-2 p-1 bg-gray-100 rounded-lg shadow-inner flex-wrap">
            <button
              v-for="role in roles"
              :key="role"
              @click="currentFilter = role"
              :class="filterButtonClass(role)"
            >
              {{ formatRole(role) }}
            </button>
          </div>

          <!-- Búsqueda (Simulada) -->
          <div class="w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bd-gold-accent focus:border-bd-gold-accent transition duration-150"
            />
          </div>
        </div>

        <!-- Tabla de Usuarios -->
        <div class="overflow-x-auto shadow-md rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-bd-purple-dark text-white sticky top-0">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">ID</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Email</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Estado</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Rol Actual</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition duration-100">
                
                <!-- ID -->
                <td class="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-500 hidden sm:table-cell">{{ user.id.substring(0, 8) }}...</td>
                
                <!-- Nombre -->
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ user.name }}
                  <span class="text-xs text-gray-500 block md:hidden">{{ user.email }}</span>
                </td>
                
                <!-- Email -->
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">{{ user.email }}</td>
                
                <!-- Estado -->
                <td class="px-4 py-4 whitespace-nowrap text-center">
                  <span :class="statusBadgeClass(user.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ user.status }}
                  </span>
                </td>
                
                <!-- Rol Actual -->
                <td class="px-4 py-4 whitespace-nowrap text-center">
                  <span :class="roleBadgeClass(user.role)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ formatRole(user.role) }}
                  </span>
                </td>
                
                <!-- Acciones (Cambiar Rol) -->
                <td class="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <select 
                    @change="handleRoleChange(user.id, ($event.target as HTMLSelectElement).value as User['role'])"
                    :value="user.role"
                    class="p-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-bd-purple-dark transition duration-150 cursor-pointer focus:ring-bd-gold-accent focus:border-bd-gold-accent"
                  >
                    <option v-for="r in allRoles" :key="r" :value="r">
                        Asignar: {{ formatRole(r) }}
                    </option>
                  </select>
                </td>
              </tr>
              <!-- Mensaje de no resultados -->
              <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="p-10 text-center text-lg text-gray-500">
                    No se encontraron usuarios para el filtro '{{ formatRole(currentFilter) }}'.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'; 
// Importamos la librería para añadir los iconos al componente
import { library } from '@fortawesome/fontawesome-svg-core';
// Importamos los íconos solid usados en este componente
import { faUsers, faFilter } from '@fortawesome/free-solid-svg-icons';
library.add(faUsers, faFilter);


// --- Definiciones de Tipos de Datos ---

type Role = 'CLIENTE' | 'EMPLEADO' | 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVO' | 'INACTIVO';
}

type Filter = 'ALL' | Role;

// --- Datos de Estado ---

const allRoles: Role[] = ['CLIENTE', 'EMPLEADO', 'ADMIN'];
const roles: Filter[] = ['ALL', ...allRoles]; // Para las pestañas de filtrado

// Estado del filtro seleccionado
const currentFilter = ref<Filter>('ALL');

// Datos simulados de usuarios (en una aplicación real, esto vendría de Firestore)
const users = ref<User[]>([
  { id: 'u001', name: 'Laura Gómez', email: 'laura.gomez@ejemplo.com', role: 'ADMIN', status: 'ACTIVO' },
  { id: 'u002', name: 'Javier Toledo', email: 'javier.toledo@ejemplo.com', role: 'CLIENTE', status: 'ACTIVO' },
  { id: 'u003', name: 'Carlos Díaz', email: 'carlos.diaz@bd.com', role: 'EMPLEADO', status: 'ACTIVO' },
  { id: 'u004', name: 'Sofía Reyes', email: 'sofia.reyes@bd.com', role: 'EMPLEADO', status: 'INACTIVO' },
  { id: 'u005', name: 'Martín Pérez', email: 'martin.perez@ejemplo.com', role: 'CLIENTE', status: 'ACTIVO' },
  { id: 'u006', name: 'Elena Torres', email: 'elena.torres@ejemplo.com', role: 'CLIENTE', status: 'ACTIVO' },
]);

// --- Lógica de Componente ---

// Función para cambiar el rol de un usuario (simulación de actualización)
const handleRoleChange = (userId: string, newRole: Role) => {
  // CORRECCIÓN DE TYPESCRIPT: Usamos .find() para obtener el objeto usuario, o 'undefined'.
  const userToUpdate = users.value.find(u => u.id === userId);
  
  // Verificamos si el usuario fue encontrado antes de intentar actualizar su rol.
  if (userToUpdate) {
    userToUpdate.role = newRole;
    console.log(`Rol del usuario ${userToUpdate.name} actualizado a ${newRole}`);
    // En una aplicación real, aquí llamarías a una función para actualizar Firestore.
  } else {
    console.error(`Error: Usuario con ID ${userId} no encontrado para actualizar el rol.`);
  }
};

// Propiedad computada para filtrar la lista de usuarios
const filteredUsers = computed(() => {
  if (currentFilter.value === 'ALL') {
    return users.value;
  }
  return users.value.filter(user => user.role === currentFilter.value);
});

// --- Funciones de Estilo y Formato ---

// Devuelve el texto legible del rol
const formatRole = (role: Filter): string => {
  const roleMap = {
    ALL: 'Todos',
    CLIENTE: 'Cliente',
    EMPLEADO: 'Empleado',
    ADMIN: 'Administrador',
  };
  return roleMap[role] || role;
};

// Clases para los badges de Rol
const roleBadgeClass = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-bd-purple-dark text-white';
    case 'EMPLEADO':
      return 'bg-bd-gold-accent text-gray-900';
    case 'CLIENTE':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Clases para los badges de Estado
const statusBadgeClass = (status: User['status']): string => {
  switch (status) {
    case 'ACTIVO':
      return 'bg-green-100 text-green-800';
    case 'INACTIVO':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Clases para los botones de filtro (pestañas)
const filterButtonClass = (role: Filter): string => {
  let baseClasses = 'px-4 py-2 text-sm font-semibold rounded-md transition duration-200 cursor-pointer';
  if (currentFilter.value === role) {
    // Clase activa: Morado de fondo, texto blanco, sombra
    baseClasses += ' bg-bd-purple-dark text-white shadow-md hover:bg-bd-purple-dark/90';
  } else {
    // Clase inactiva: Fondo transparente, texto morado, hover dorado
    baseClasses += ' text-bd-purple-dark hover:bg-bd-gold-accent hover:text-gray-900';
  }
  return baseClasses;
};

</script>

<style lang="postcss" scoped>
/*
|--------------------------------------------------------------------------
| 🎨 ESTILOS LOCALES PARA GESTIÓN DE USUARIOS (PALETA DE COLORES)
|--------------------------------------------------------------------------
*/

/* Morado Oscuro (Principal) - #4A148C */
.text-bd-purple-dark { color: #4A148C; }
.bg-bd-purple-dark { background-color: #4A148C; }
.border-bd-purple-dark { border-color: #4A148C; }

/* Dorado/Ocre (Acento) - #FFC107 */
.text-bd-gold-accent { color: #FFC107; }
.border-bd-gold-accent { border-color: #FFC107; }
.bg-bd-gold-accent { background-color: #FFC107; }

/* Morado Claro (Fondo de Página) - Suave */
.bg-bd-light-purple { background-color: #F3F0F7; }

/* Estilo para los selectores de rol */
select {
    /* Eliminar el estilo nativo para un look más limpio */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%234A148C'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em;
    padding-right: 2.5rem !important; /* Asegura espacio para el icono */
}

</style>