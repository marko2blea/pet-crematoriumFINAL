export interface User {
  id_usuario: number;
  nombre: string | null;
  apellido_paterno: string | null;
  correo: string | null;
  telefono: number | null;
  id_rol: number | null;
}