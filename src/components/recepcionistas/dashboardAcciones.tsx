import { Calendar2Week, CalendarPlus, PersonPlus } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const DashboardAcciones = () => {
    return (
        <div className="d-flex align-items-center flex-wrap gap-2">
            <Link
                to="/nuevo-paciente"
                className="btn btn-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
            >
                <PersonPlus size={18} aria-hidden="true" />
                Nuevo Paciente
            </Link>
            <Link
                to="/nuevo-ingreso"
                className="btn btn-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
            >
                <PersonPlus size={18} aria-hidden="true" />
                Paciente y Turno
            </Link>
            <Link
                to="/nuevo-turno"
                className="btn btn-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
            >
                <CalendarPlus size={18} aria-hidden="true" />
                Nuevo Turno
            </Link>
            <Link
                to="/turnos-futuros"
                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center justify-content-center gap-2"
            >
                <Calendar2Week size={18} aria-hidden="true" />
                Turnos Futuros
            </Link>
        </div>
    );
};

export default DashboardAcciones;