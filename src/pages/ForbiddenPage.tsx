import { Link } from "react-router-dom";
import { ShieldFill } from "react-bootstrap-icons"; // 
import { Container } from "react-bootstrap";

export default function ForbiddenPage() {
  return (
    <Container 
      fluid 
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light px-3 text-center"
    >
      
      <ShieldFill className="mb-3 text-danger" style={{ width: "80px", height: "80px" }} />

      <h1 className="display-1 fw-bold text-dark">403</h1>

      <h2 className="mt-2 h3 fw-semibold text-secondary">
        Acceso denegado
      </h2>

      <p className="mt-3 text-muted mx-auto" style={{ maxWidth: "450px" }}>
        No tenés permisos suficientes para acceder a esta sección.
        Si creés que se trata de un error, contactá al administrador.
      </p>

      
     <Link  to="/"
      className="btn btn-primary mt-4 px-4 py-2 fw-medium"
      >
      Volver al inicio
</Link>
    </Container>
  );
}
