/**
 * Este es un middleware de ruta NOMBRADO (auth.ts).
 * Lo aplicaremos a las páginas que queramos proteger.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  
  // 1. Obtener el estado global del usuario
  const user = useUser();

  // 2. Revisar si el usuario NO ha iniciado sesión
  if (!user.value) {
    // Si no hay usuario, lo enviamos al login.
    // Incluimos la ruta a la que intentaba ir (to.fullPath)
    // para que 'login.vue' pueda redirigirlo de vuelta después.
    return navigateTo(`/login?redirectTo=${to.fullPath}`);
  }

  // 3. (OPCIONAL PERO RECOMENDADO) Revisar si el usuario es solo un "Cliente"
  // Asumiendo que tu ROL de Cliente tiene id_rol = 1 (según tu SQL).
  // Solo los roles 2 (Admin), 3 (Superadmin), etc., pueden entrar.
  if (user.value.id_rol === 1) {
    // Si es un cliente (rol 1), lo expulsamos a la página de inicio.
    return navigateTo('/');
  }

  // 4. Si el usuario existe (logueado) Y es Admin (no es rol 1),
  // no hacemos nada y dejamos que continúe.
});