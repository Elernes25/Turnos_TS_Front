import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar'; // Importa el componente anterior
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    // fluid elimina los márgenes laterales y d-flex alinea el sidebar con el contenido
    <Container fluid className="p-0 d-flex">
      
      {/* 1. Sidebar Fijo (Se oculta en celulares 'd-none' y aparece desde 'd-md-flex') */}
      <div className="d-none d-md-flex">
        <Sidebar />
      </div>

      {/* 2. Contenedor del Contenido Principal (Toma todo el espacio restante flex-grow-1) */}
      <div className="flex-grow-1 vh-100 overflow-auto bg-light">
        
        {/* Navbar superior miniatura opcional para móviles (aparece solo en d-block d-md-none) */}
        <div className="bg-dark text-white p-3 d-block d-md-none text-center">
          <span className="fw-bold">Mi Sistema (Móvil)</span>
          {/* Aquí podrías poner un botón de hamburguesa si quieres colapsarlo en celular */}
        </div>

        {/* Aquí se renderizan las páginas hijas del sistema */}
        <Container className="p-4">
          <Outlet /> {/* Si usas React Router, si no, coloca tu componente aquí directamente */}
        </Container>
      </div>

    </Container>
  );
};

export default DashboardLayout;