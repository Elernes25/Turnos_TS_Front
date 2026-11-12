import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  HouseDoor, 
  PersonPlus, 
  HeartPulse, 
  People, 
  Hospital, 
  ClipboardCheck, 
  Clipboard2Check,
  ShieldLock, 
  CalendarWeek, 
  PersonCircle, 
  BoxArrowRight,
  ShieldPlus,
  type Icon
} from 'react-bootstrap-icons';
import logo1 from '../../assets/logo1.png';

import { getSession, clearSession, subscribeSession } from '../../auth/session'; 
import { RolUsuario } from '../../types/Usuario.type';
import styles from './Sidebar.module.scss';


interface MenuItem {
  ruta: string;
  texto: string;
  icono: Icon;
  end?: boolean;
  roles: RolUsuario[];
}

// 1. Definimos los enlaces usando tus tipos exactos de RolUsuario
const MENU_ITEMS: MenuItem[] = [
  { 
    ruta: '/', 
    texto: 'Dashboard', 
    icono: HouseDoor, 
    end: true, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.MEDICO, RolUsuario.RECEPCIONISTA, RolUsuario.PACIENTE] 
  },
  { 
    ruta: '/nuevo-paciente', 
    texto: 'Registrar Paciente', 
    icono: PersonPlus, 
    roles: [RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA] 
  },
  { 
    ruta: '/nuevo-medico', 
    texto: 'Registrar Médico', 
    icono: HeartPulse, 
    roles: [RolUsuario.ADMIN] 
  },
  { 
    ruta: '/listado-medicos', 
    texto: 'Listado Médicos', 
    icono: People, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.RECEPCIONISTA] 
  },
  {
    ruta: '/turnos',
    texto: 'Listado de Turnos',
    icono: Clipboard2Check,
    roles: [RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA]
  },
  { 
    ruta: '/medicos', 
    texto: 'Médicos', 
    icono: People, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR] 
  },
  { 
    ruta: '/especialidades', 
    texto: 'Especialidades', 
    icono: Hospital, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR] 
  },
  { 
    ruta: '/supervisor', 
    texto: 'Dashboard Supervisor', 
    icono: ClipboardCheck, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR] 
  },
  { 
    ruta: '/administrador', 
    texto: 'Administrador', 
    icono: ShieldLock, 
    roles: [RolUsuario.ADMIN] 
  },
  { 
    ruta: '/administrador-agenda', 
    texto: 'Agenda Médicos', 
    icono: CalendarWeek, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.MEDICO, RolUsuario.RECEPCIONISTA] 
  },
    { 
    ruta: '/obra-social', 
    texto: 'Obra Social', 
    icono: ShieldPlus, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.MEDICO, RolUsuario.RECEPCIONISTA] 
  },
  { 
    ruta: '/perfil', 
    texto: 'Mi Perfil', 
    icono: PersonCircle, 
    roles: [RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.MEDICO, RolUsuario.RECEPCIONISTA, RolUsuario.PACIENTE] 
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  
  // 2. Estado reactivo conectado a getSession()
  const [session, setSession] = useState(() => getSession());

  // 3. Escuchamos cambios en la sesión (login, logout o cambios en otra pestaña)
  useEffect(() => {
    const actualizarSesion = () => setSession(getSession());
    return subscribeSession(actualizarSesion);
  }, []);

  const cerrarSesion = () => {
    clearSession(); // Usa tu función para borrar el token y disparar el evento
    navigate('/login');
  };

 const estiloEnlace = ({ isActive }: { isActive: boolean }) =>
    `nav-link text-white rounded p-2 d-flex align-items-center gap-2 ${
      isActive ? 'bg-primary' : styles.hoverEffect
    }`;

  // Si no hay sesión válida, no renderizamos el sidebar (o podrías redirigir)
  if (!session) return null;

  // 4. Filtramos según el rol decodificado del JWT
  const enlacesPermitidos = MENU_ITEMS.filter((item) => 
    item.roles.includes(session.rol)
  );

  return (
    <div 
      className="bg-dark text-white p-3 d-flex flex-column vh-100 position-sticky top-0"
      style={{ minWidth: '220px', maxWidth: '220px' }}
    >
    <div className="text-center my-2 flex-shrink-0">
        <img src={logo1} alt="Salud Municipal" className="rounded-circle mb-1" style={{ width: '36px', height: '36px', objectFit: 'cover' }}
        />

        <h6 className="fw-bold mb-0">Salud Municipal</h6>
        <small className="text-info d-block">{session.user}</small>
        <span className="badge bg-secondary mt-1">{session.rol}</span>
    </div>
      <hr className="text-secondary flex-shrink-0" />

      {/* Navegación filtrada por rol */}
      <Nav className={`flex-column flex-nowrap flex-grow-1 gap-2 ${styles.menuScroll}`}
      style={{ minHeight: 0 }}
      >
        {enlacesPermitidos.map((item) => {
          const IconoComponente = item.icono;
          return (
            <NavLink 
              key={item.ruta} 
              
              to={item.ruta} 
              end={item.end} 
              className={estiloEnlace}
            >
              <IconoComponente size={18} />
              <span>{item.texto}</span>
            </NavLink>
          );
        })}
      </Nav>

      <hr className="text-secondary" />

      {/* Botón de Salida */}
      <button 
        onClick={cerrarSesion} 
        className="text-danger rounded p-2 w-100 text-start bg-transparent border-0 hover-effect d-flex align-items-center gap-2 flex-shrink-0"
      >
        <BoxArrowRight size={18} />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;





/*import { Nav } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div 
      className="bg-dark text-white p-3 d-flex flex-column vh-100 position-sticky top-0"
      style={{ minWidth: '200px', maxWidth: '200px' }}
    >
      <div className="text-center my-4">
        <h3 className="fw-bold">Mi Sistema</h3>
        <small className="text-muted">Panel de Control</small>
      </div>
      
      <hr className="text-secondary" />

      {// Navegación //}
      <Nav className="flex-column flex-grow-1 gap-2">
        
        {// 1. Inicio //}
        <NavLink to="/" 
          className={({ isActive }) => 
            `nav-link text-white rounded p-2 ${isActive ? 'bg-primary' : 'hover-effect'}`
          }
        >
          Dashboard
        </NavLink>
        <Nav.Link as={Link} to="/nuevo-paciente"> Registrar Paciente </Nav.Link>
        <Nav.Link as={Link} to="/nuevo-medico"> Registrar Medico </Nav.Link>
        <Nav.Link as={Link} to="/listado-medicos"> Listado Medicos </Nav.Link>
        <Nav.Link as={Link} to="/medicos" > Medicos</Nav.Link> 
        <Nav.Link as={Link} to="/medicos/:id/editar" > *EditarMedico</Nav.Link> 

        <Nav.Link as={Link} to="/especialidades"> Especialidades </Nav.Link>
        <Nav.Link as={Link} to="/Obra Social"> Obra Social </Nav.Link>
        <Nav.Link as={Link} to="/supervisor"> DashboardSupervisor </Nav.Link>
        <Nav.Link as={Link} to="/administrador"> Administrador </Nav.Link>
        {/*<Nav.Link as={Link} to="/medicos/:id/agenda"> Agenda Medicos </Nav.Link>*}

        {// 3. Mi Perfil //}
        <NavLink 
          to="/perfil" 
          className={({ isActive }) => 
            `nav-link text-white rounded p-2 ${isActive ? 'bg-primary' : 'hover-effect'}`
          }
        >
          Mi Perfil
        </NavLink>

      </Nav>

      <hr className="text-secondary" />

      {// Botón de Salida //}
      <button 
        onClick={cerrarSesion} 
        className="text-danger rounded p-2 w-100 text-start bg-transparent border-0 hover-effect"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;
*/