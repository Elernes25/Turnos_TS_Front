import { Card } from "react-bootstrap";
import { Calendar2Week, CalendarPlus, PersonPlus } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const DashboardAcciones = () => {
    return (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold">
                Acciones rápidas
            </Card.Header>
            <Card.Body className="d-flex flex-wrap gap-3">
                <Link
                    to="/nuevo-paciente"
                    className="btn btn-primary d-inline-flex flex-grow-1 align-items-center justify-content-center gap-2"
                >
                    <PersonPlus size={18} aria-hidden="true" />
                    Nuevo Paciente
                </Link>
                <Link
                    to="/nuevo-turno"
                    className="btn btn-primary d-inline-flex flex-grow-1 align-items-center justify-content-center gap-2"
                >
                    <CalendarPlus size={18} aria-hidden="true" />
                    Nuevo Turno
                </Link>
                <Link
                    to="/turnos-futuros"
                    className="btn btn-outline-primary d-inline-flex flex-grow-1 align-items-center justify-content-center gap-2"
                >
                    <Calendar2Week size={18} aria-hidden="true" />
                    Turnos Futuros
                </Link>
            </Card.Body>
        </Card>
    );
};

export default DashboardAcciones;