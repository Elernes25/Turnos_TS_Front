import { useState } from 'react';
import { Button, Container, Offcanvas } from 'react-bootstrap';
import { List as MenuIcon } from 'react-bootstrap-icons';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  return (
    <Container fluid className="p-0 d-flex">
      <div className="d-none d-md-flex">
        <Sidebar />
      </div>

      <div className="flex-grow-1 vh-100 overflow-auto" style={{ background: '#08100c' }}>
        <div className="bg-dark text-white p-3 d-flex d-md-none align-items-center justify-content-between">
          <span className="fw-bold">Salud Municipal</span>
          <Button
            variant="outline-light"
            aria-label="Abrir menú"
            aria-expanded={mostrarMenu}
            onClick={() => setMostrarMenu(true)}
          >
            <MenuIcon aria-hidden="true" />
            <span className="ms-2">Menú</span>
          </Button>
        </div>

        <Container className="p-4">
          <Outlet />
        </Container>
      </div>

      <Offcanvas
        show={mostrarMenu}
        onHide={() => setMostrarMenu(false)}
        placement="start"
        className="d-md-none"
        aria-labelledby="menu-movil-titulo"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="menu-movil-titulo">Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column overflow-hidden">
          <Sidebar
            mobile
            onNavigate={() => setMostrarMenu(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default DashboardLayout;