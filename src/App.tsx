import { Toaster } from "sonner"
import DashboardRecepcion from "./pages/DashboardRecepcion"
import FormularioPaciente from "./components/pacientes/FormularioPaciente"
import FormularioMedico from "./components/medicos/FormularioMedico"
import ListadoEspecialidades from "./components/especialidad/ListadoEspecialidades"
import ListadoMedicos from "./components/medicos/ListadoMedicos"
import DetalleTurno from "./components/turnos/DetalleTurno"
import NotFound from "./components/utils/notfound"
import LoginPage from  './pages/Login'
//import PrivateRoute from "./components/utils/privateRoute"
import LogoutButton from "./components/logoutButton"

import { Routes, Route, Navigate, Outlet} from "react-router-dom";
//import LayoutPrincipal from "./components/layout/LayoutPrincipal";
import DashboardLayout from "./components/layout/DashboardLayout"
import FormularioAdministrador from "./components/administrador/FormularioAdministrador"
import FormularioAgendaMedico from "./components/administrador/FormularioAgenda"
import ForbiddenPage from "./pages/ForbiddenPage"

//import { jwtDecode } from "jwt-decode";
//import type {ITokenPayload} from "./types/Usuario.type";
import { IRolUsuario, RolUsuario } from "./types/Usuario.type"
import { getSession } from "./auth/session"
import DashboardSupervisor from "./components/supervisor/DashboardSupervisor"
import PrimerIngreso from "./pages/PrimerIngreso"
import { useLocation } from "react-router-dom";

interface RutaPrivadaProps {
    roles: IRolUsuario[];
}

const RutasProtegidas = ({roles}:RutaPrivadaProps) => {
  //const token = localStorage.getItem('token');
    const session = getSession();
    const location = useLocation();
    if (!session || !session.activo) return <Navigate to="/login" replace />; //if (!roles.includes(session.rol)) return <Navigate to="/" replace />;
    
    console.log("SESSION:", session);
    if (session.debeCambiarPassword && location.pathname !== "/primer-ingreso")
        {return <Navigate to="/primer-ingreso" replace />;}

    
    //donde /403 muestra algo tipo:
    //  No tienes permisos para acceder a esta página.
    const autorizado = roles.includes(session.rol);
    if (!autorizado) 
        { return <Navigate to="/403" replace />; }
    

    return <Outlet />;
}


function App() {
  return (
    <>
        <Toaster position="top-right" richColors />
        <Routes>
            {/*ZONA DE RUTAS PUBLICAS */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/primer-ingreso" element={<PrimerIngreso />} />
            {/*ZONA DE RUTAS PROTEGIDAS */}
            <Route element={<RutasProtegidas 
                        roles={[RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.MEDICO,
                                RolUsuario.RECEPCIONISTA, RolUsuario.PACIENTE]} />}>  {/* devuelve Outlet o Navigate */}
                <Route path="/" element={<DashboardLayout />}>      {/*element={<LayoutPrincipal />}>*/}
                    <Route index element={<DashboardRecepcion />} />
                    
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.RECEPCIONISTA]} />}>
                        <Route path="nuevo-paciente" element={<FormularioPaciente />} />
                        <Route path="turno-detalle/:id" element={<DetalleTurno />} />
                    </Route>
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.SUPERVISOR]} />}>
                        <Route path="nuevo-medico" element={<FormularioMedico />} />
                        <Route path="supervisor" element={<DashboardSupervisor />} />
                    </Route>
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.SUPERVISOR,RolUsuario.MEDICO,RolUsuario.RECEPCIONISTA]} />}>
                        <Route path="listado-medicos" element={<ListadoMedicos />} />
                        <Route path="especialidades" element={<ListadoEspecialidades />} />
                    </Route>
                    
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN]} />}>
                        <Route path="administrador" element={<FormularioAdministrador />} />
                        <Route path="administrador-agenda" element={<FormularioAgendaMedico/>} />
                    </Route>

                    <Route path="cerrar-sesion" element={<LogoutButton />} />
                    <Route path="*" element={<NotFound />} />
                    
                </Route>
                <Route path="*" element={<NotFound />} />   {/* para evitar un  /loquesea */}
            </Route> {/* rutas protegidas */}
        </Routes>
    </>
  )
}

export default App

