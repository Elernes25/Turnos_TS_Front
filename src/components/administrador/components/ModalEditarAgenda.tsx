import { Button, Modal } from 'react-bootstrap';

interface ModalEditarAgendaProps {
    show: boolean;
    onVolverMedicos: () => void;
    onVolverEditar: () => void;
}

const ModalEditarAgenda = ({
    show,
    onVolverMedicos,
    onVolverEditar,
}: ModalEditarAgendaProps) => (
    <Modal show={show} onHide={onVolverEditar} centered>
        <Modal.Header closeButton>
            <Modal.Title>Agenda actualizada</Modal.Title>
        </Modal.Header>
        <Modal.Body>La agenda se actualizó con éxito.</Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="outline-secondary" onClick={onVolverMedicos}>
                Volver a Médicos
            </Button>
            <Button type="button" variant="primary" onClick={onVolverEditar}>
                Volver a Editar
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ModalEditarAgenda;
