import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const DashboardAcciones = () => {
    return (
        <Card className="mb-3">

            <Card.Header>
                Acciones rápidas
            </Card.Header>

            <Card.Body className="d-grid gap-2">
                <Link to="/pacientes/nuevo">
                    <Button> Nuevo Paciente </Button>
                </Link>
                <Link to="/turnos/nuevo">
                    <Button> Nuevo Turno </Button>
                </Link>
             </Card.Body>

        </Card>
    );
};

export default DashboardAcciones;