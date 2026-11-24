import { Toaster } from "sonner"
import DashboardRecepcion from "./pages/DashboardRecepcion"
import FormularioPaciente from "./components/pacientes/FormularioPaciente"
import EditarPaciente from "./components/pacientes/EditarPaciente"
import FormularioMedico from "./components/medicos/FormularioMedico"
import FormularioEspecialidades from "./components/especialidad/FormularioEspecialidades"
import ListadoMedicos from "./components/medicos/ListadoMedicos"
import DetalleTurno from "./components/turnos/DetalleTurno"
import NotFound from "./components/utils/notfound"
import LoginPage from  './pages/Login'
import LogoutButton from "./components/logoutButton"

import { Routes, Route, Navigate, Outlet} from "react-router-dom";
//import LayoutPrincipal from "./components/layout/LayoutPrincipal";
import DashboardLayout from "./components/layout/DashboardLayout"
import FormularioAdministrador from "./components/administrador/FormularioAdministrador"
import FormularioAgendaMedico from "./components/administrador/FormularioAgenda"
import FormularioObraSocial from "./components/obraSocial/FormularioObraSocial"
import ForbiddenPage from "./pages/ForbiddenPage"
import EditarMedico from "./components/medicos/components/EditarMedico"
import DetalleMedico from "./components/medicos/DetalleMedico"

//import { jwtDecode } from "jwt-decode";
//import type {ITokenPayload} from "./types/Usuario.type";
import { IRolUsuario, RolUsuario } from "./types/Usuario.type"
import { getSession } from "./auth/session"
import DashboardSupervisor from "./components/supervisor/DashboardSupervisor"
import DashboardMedicos from "./pages/DashboardMedicos"
import HistoriaClinica from "./components/atencionMedica/HistoriaClinica"
import EditarHistoriaClinica from "./components/atencionMedica/EditarHistoriaClinica"
import ConsultaClinica from "./components/atencionMedica/ConsultaClinica"
import ListadoConsultasClinicas from "./components/atencionMedica/ListadoConsultasClinicas"
import MisConsultas, { DetalleMisConsulta } from "./components/atencionMedica/misConsultas"
import PrimerIngreso from "./pages/PrimerIngreso"
import { useLocation } from "react-router-dom";
import ListadoMedicosMain from "./components/medicos/ListadoMedicosMain"
import ListadoTurnos from "./components/turnos/ListadoTurnos"
import FormularioTurno from "./components/turnos/FormularioTurno"
import TurnosFuturos from "./components/turnos/TurnosFuturos"
import FormularioRecepcionista from "./components/recepcionistas/FormularioRecepcionista"
import ListadoRecepcionistaMain from "./components/recepcionistas/ListadoRecepcionistaMain"
import EditarRecepcionista from "./components/recepcionistas/EditarRecepcionista"
import DetalleRecepcionista from "./components/recepcionistas/DetalleRecepcionista"
import Paciente from "./components/recepcionistas/Paciente"
import { DashboardPorRol } from "./components/layout/DashboardPorRol"
import MiPerfil from "./pages/MiPerfil"
import Usuarios from "./components/administrador/Usuarios"

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
                    <Route index element={<DashboardPorRol/>} />                    
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.RECEPCIONISTA]} />}>
                        <Route path="recepcion"  element={<DashboardRecepcion />} />
                        <Route path="nuevo-paciente" element={<FormularioPaciente />} />
                        <Route path="editar-paciente" element={<EditarPaciente />} />
                        <Route path="nuevo-ingreso" element={<Paciente />} />
                        <Route path="nuevo-turno" element={<FormularioTurno />} />
                        <Route path="nuevo-turno/:id" element={<FormularioTurno />} />
                        <Route path="turnos" element={<ListadoTurnos />} />
                        <Route path="turnos-futuros" element={<TurnosFuturos />} />
                        <Route path="turno-detalle/:id" element={<DetalleTurno />} />
                        
                    </Route>
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.SUPERVISOR]} />}>
                        <Route path="usuarios" element={<Usuarios />} />
                        <Route path="nuevo-medico" element={<FormularioMedico />} />
                        <Route path="supervisor" element={<DashboardSupervisor />} />
                        <Route path="medicos" element={<ListadoMedicosMain/>} />
                        <Route path="medicos/:id/editar" element={<EditarMedico />} />
                        <Route path="medicos/:id/agenda" element={<FormularioAgendaMedico/>} />
                        <Route path="nuevo-recepcionista" element={<FormularioRecepcionista/>} />
                        <Route path="recepcionistas" element={<ListadoRecepcionistaMain/>} />
                        <Route path="recepcionista/:id/editar" element={<EditarRecepcionista/>} />
                        <Route path="recepcionista-detalle/:id" element={<DetalleRecepcionista/>} />
                    </Route>
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.SUPERVISOR,RolUsuario.MEDICO,RolUsuario.RECEPCIONISTA]} />}>
                        <Route path="listado-medicos" element={<ListadoMedicos />} />
                        <Route path="especialidades" element={<FormularioEspecialidades />} />
                        <Route path="medico-detalle/:id" element={<DetalleMedico />} />
                        <Route path="perfil" element={<MiPerfil />} />
                    </Route>
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN, RolUsuario.MEDICO]} />}>
                        <Route path="historia-clinica/:pacienteId" element={<HistoriaClinica />} />
                        <Route path="historiaclinica/:id/editar" element={<EditarHistoriaClinica />} />
                        <Route path="consulta-nueva/:pacienteId" element={<ConsultaClinica />} />
                        <Route path="consultas-clinicas/:pacienteId" element={<ListadoConsultasClinicas />} />
                        <Route path="mis-consultasl" element={<MisConsultas />} />
                        <Route path="mis-consultasl/:consultaId" element={<DetalleMisConsulta />} />
                        <Route path="medico" element={<DashboardMedicos />}/>
                    </Route>
                     <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN,RolUsuario.SUPERVISOR,RolUsuario.RECEPCIONISTA]} />}>
                        <Route path="obra-social" element={<FormularioObraSocial />} />
                    </Route>
                    <Route element={<RutasProtegidas roles={[RolUsuario.ADMIN]} />}>
                        <Route path="administrador" element={<FormularioAdministrador />} />
                        
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
