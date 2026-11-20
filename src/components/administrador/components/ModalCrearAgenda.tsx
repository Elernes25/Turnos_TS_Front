import { Button, Modal } from 'react-bootstrap';

interface ModalCrearAgendaProps {
    show: boolean;
    onVolverMedicos: () => void;
}

const ModalCrearAgenda = ({ show, onVolverMedicos }: ModalCrearAgendaProps) => (
    <Modal show={show} onHide={onVolverMedicos} centered>
        <Modal.Header closeButton>
            <Modal.Title>Agenda creada</Modal.Title>
        </Modal.Header>
        <Modal.Body>La agenda se creó con éxito.</Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="primary" onClick={onVolverMedicos}>
                Volver a Médicos
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ModalCrearAgenda;
