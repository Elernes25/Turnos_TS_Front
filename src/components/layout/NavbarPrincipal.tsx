import {Navbar,Container,Nav } from "react-bootstrap";
import {Link} from "react-router-dom";

const NavbarPrincipal = ()=> {
    return(
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Salita Municipal</Navbar.Brand>
                <Navbar.Toggle  aria-controls="basic-navbar-nav"></Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/"> Dashboard </Nav.Link>
                        <Nav.Link as={Link} to="/nuevo-paciente"> Registrar Paciente </Nav.Link>
                        <Nav.Link as={Link} to="/nuevo-medico"> Registrar Medico </Nav.Link>
                        <Nav.Link as={Link} to="/listado-medicos"> Listado Medicos </Nav.Link>
                        <Nav.Link as={Link} to="/especialidades"> Especialidades </Nav.Link>
                        <Nav.Link as={Link} to="/supervisor"> DashboardSupervisor </Nav.Link>
                        <Nav.Link as={Link} to="/login"> Login </Nav.Link>
                        <Nav.Link as={Link} to="/cerrar-sesion"> Cerrar Sesión </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )


}
export default NavbarPrincipal;

