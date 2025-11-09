import { type User } from '~/types';

/**
 * Este es el estado global que contendrá al usuario.
 * - Si es 'null', el usuario no ha iniciado sesión.
 * - Si tiene un objeto 'User', el usuario sí inició sesión.
 */
export const useUser = () => useState<User | null>('user', () => null);