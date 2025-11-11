// (Esto es lo que probablemente ya tienes, basado en tu schema)
export type User = {
  id_usuario: number;
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  correo: string | null;
  telefono: number | null;
  region: string | null;
  comuna: string | null;
  direccion: string | null;
  id_rol: number | null;
  // ... (otros campos que puedas tener)
}

// (AÑADE ESTE NUEVO TIPO)
// Esto define la forma de los datos que vienen de la API /api/roles.get.ts
export type Rol = {
  id_rol: number;
  nombre_rol: string | null;
}