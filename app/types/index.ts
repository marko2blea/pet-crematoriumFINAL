export interface User {
  id_usuario: number;
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null; // <-- AÑADIDO
  correo: string | null;
  telefono: number | null;
  id_rol: number | null;
  region: string | null;         // <-- AÑADIDO
  comuna: string | null;         // <-- AÑADIDO
  direccion: string | null;      // <-- AÑADIDO
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
}

// (ESTO ES LO QUE FALTABA) Interfaz para un item en el carrito
export interface CartItem extends Product {
  quantity: number;
}