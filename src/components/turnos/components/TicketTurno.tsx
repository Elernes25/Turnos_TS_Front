import ticketStyles from "../TicketTurno.module.scss";
import { Button, Modal } from "react-bootstrap";
import type { ITicketTurno } from "../../../types/TicketTurno.types";

interface TicketTurnoProps {
    turnoRegistrado: ITicketTurno | null;
    onClose: () => void;
};

const TicketTurno = ({ turnoRegistrado, onClose}: TicketTurnoProps) => {
return(
    <Modal
        show={turnoRegistrado !== null}
        onHide={() => onClose()}
        centered
        aria-labelledby="turno-registrado-titulo"
    >
        <Modal.Header closeButton className={ticketStyles.modalHeader}>
            <Modal.Title id="turno-registrado-titulo">Turno Registrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {turnoRegistrado && (
                <div className={ticketStyles.ticket}>
                    <p className={ticketStyles.confirmacion}>Reserva confirmada</p>
                    <dl className={ticketStyles.detalles}>
                        <div>
                            <dt>Paciente</dt>
                            <dd>{turnoRegistrado.paciente}</dd>
                        </div>
                        <div>
                            <dt>Especialidad</dt>
                            <dd>{turnoRegistrado.especialidad}</dd>
                        </div>
                        <div>
                            <dt>Médico</dt>
                            <dd>{turnoRegistrado.medico}</dd>
                        </div>
                        <div className={ticketStyles.fechaHora}>
                            <div>
                                <dt>Fecha</dt>
                                <dd>{turnoRegistrado.fecha}</dd>
                            </div>
                            <div>
                                <dt>Hora</dt>
                                <dd>{turnoRegistrado.hora} hs</dd>
                            </div>
                        </div>
                        <div>
                            <dt className="text-center">Asistir y anunciarse con 15 minutos de anticipación</dt>
                        </div>
                    </dl>
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={() => onClose()}>Aceptar</Button>
        </Modal.Footer>
    </Modal>
);
}

export default TicketTurno;