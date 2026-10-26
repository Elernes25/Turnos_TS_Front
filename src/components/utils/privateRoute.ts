
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
    const token = localStorage.getItem("token");
    console.log("Token en PrivateRoute:", token); // Agrega este console.log para depuración
    return token ? <Outlet>: <Navigate to="/login" replace />;
}

export default PrivateRoute;


/*el componente <Outlet /> es un placeholder que representa dónde se van a renderizar las rutas hijas.

Cuando definís un <Route element={<PrivateRoute />}> en App.jsx, ese PrivateRoute se convierte en un wrapper.
Dentro de él, si el token existe, devolvés <Outlet />. Eso significa:
“Renderizá aquí las rutas hijas que están anidadas bajo este Route”.
Si no hay token, devolvés <Navigate /> y redirigís al login.

Sin replace (por defecto):
El navegador agrega la nueva ruta al historial.
Ejemplo: si estabas en /dashboard y te redirige a /login, el historial queda con ambos.
Si el usuario hace “Atrás”, vuelve a /dashboard.

Con replace:
La nueva ruta reemplaza la actual en el historial.
Ejemplo: estabas en /dashboard, se ejecuta <Navigate to="/login" replace />. 
El historial ya no guarda /dashboard, solo /login. Si el usuario hace “Atrás”, no vuelve al dashboard,
sino a la ruta anterior a esa.
*/


