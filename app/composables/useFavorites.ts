import { ref, computed } from 'vue';

/**
 * Gestiona una lista de "favoritos" (IDs de productos) usando useCookie.
 */
export const useFavorites = () => {
  // Guarda un array de números (IDs de productos) en una cookie
  const favoriteIds = useCookie<number[]>('my-favorites', {
    default: () => []
  });

  /**
   * (Ref Reactivo) La lista de IDs de productos favoritos.
   */
  const favorites = ref(favoriteIds.value);

  /**
   * Añade o quita un producto de la lista de favoritos.
   * @param id El ID del producto a añadir/quitar.
   */
  const toggleFavorite = (id: number) => {
    const index = favorites.value.indexOf(id);
    if (index === -1) {
      // No está, lo añadimos
      favorites.value.push(id);
    } else {
      // Ya está, lo quitamos
      favorites.value.splice(index, 1);
    }
    // Guardamos la lista actualizada en la cookie
    favoriteIds.value = favorites.value;
  };

  /**
   * Comprueba si un producto ya está en favoritos.
   * @param id El ID del producto a comprobar.
   * @returns true si es favorito, false si no.
   */
  const isFavorite = (id: number): boolean => {
    return favorites.value.includes(id);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};