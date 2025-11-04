// Archivo: plugins/click-outside.client.ts

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el, binding) {
      // Función que se dispara al hacer clic fuera
      el.__ClickOutsideHandler__ = (event: MouseEvent) => {
        // Verifica si el clic ocurrió fuera del elemento (el) y si la función binding.value existe
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
      // Agrega el listener global de clics al documento
      document.body.addEventListener('click', el.__ClickOutsideHandler__);
    },
    unmounted(el) {
      // Limpia el listener cuando el componente se destruye para evitar fugas de memoria
      document.body.removeEventListener('click', el.__ClickOutsideHandler__);
    },
  });
});