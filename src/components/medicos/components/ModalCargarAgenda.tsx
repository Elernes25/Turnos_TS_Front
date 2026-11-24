import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ModalCargarAgendaProps {
    medicoId: string;
    onVolver: () => void;
}

const ModalCargarAgenda = ({ medicoId, onVolver }: ModalCargarAgendaProps) => (
    <Modal show onHide={onVolver} centered backdrop="static">
        <Modal.Header closeButton>
            <Modal.Title>Médico creado con éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            ¿Desea cargar su agenda?
        </Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="secondary" onClick={onVolver}>
                Volver
            </Button>
            <Link to={`/medicos/${medicoId}/agenda`} className="btn btn-primary">
                Cargar Agenda
            </Link>
        </Modal.Footer>
    </Modal>
);

export default ModalCargarAgenda;
