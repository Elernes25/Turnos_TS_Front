import { Nav } from 'react-bootstrap';
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

      {/* Navegación */}
      <Nav className="flex-column flex-grow-1 gap-2">
        
        {/* 1. Inicio */}
        <NavLink to="/" 
          className={({ isActive }) => 
            `nav-link text-white rounded p-2 ${isActive ? 'bg-primary' : 'hover-effect'}`
          }
        >
          🏠 Dashboard
        </NavLink>
        <Nav.Link as={Link} to="/nuevo-paciente"> Registrar Paciente </Nav.Link>
        <Nav.Link as={Link} to="/nuevo-medico"> Registrar Medico </Nav.Link>
        <Nav.Link as={Link} to="/listado-medicos"> Listado Medicos </Nav.Link>
        <Nav.Link as={Link} to="/especialidades"> Especialidades </Nav.Link>
        <Nav.Link as={Link} to="/supervisor"> DashboardSupervisor </Nav.Link>
        <Nav.Link as={Link} to="/administrador"> Administrador </Nav.Link>
        <Nav.Link as={Link} to="/administrador-agenda"> Agenda Medicos </Nav.Link>

        {/* 3. Mi Perfil */}
        <NavLink 
          to="/perfil" 
          className={({ isActive }) => 
            `nav-link text-white rounded p-2 ${isActive ? 'bg-primary' : 'hover-effect'}`
          }
        >
          👤 Mi Perfil
        </NavLink>

      </Nav>

      <hr className="text-secondary" />

      {/* Botón de Salida */}
      <button 
        onClick={cerrarSesion} 
        className="text-danger rounded p-2 w-100 text-start bg-transparent border-0 hover-effect"
      >
        🚪 Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;