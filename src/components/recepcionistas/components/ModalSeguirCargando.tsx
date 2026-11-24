import { Button, Modal } from 'react-bootstrap';

interface ModalSeguirCargandoProps {
    mostrar: boolean;
    onIrARecepcionistas: () => void;
    onSeguirCargando: () => void;
    onExited: () => void;
}

const ModalSeguirCargando = ({
    mostrar,
    onIrARecepcionistas,
    onSeguirCargando,
    onExited,
}: ModalSeguirCargandoProps) => (
    <Modal
        show={mostrar}
        onHide={onSeguirCargando}
        onExited={onExited}
        centered
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header>
            <Modal.Title>El recepcionista se ha creado con éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Qué desea hacer ahora?</Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="primary" onClick={onIrARecepcionistas}>
                Ir a Recepcionista
            </Button>
            <Button type="button" variant="secondary" onClick={onSeguirCargando}>
                Seguir cargando
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ModalSeguirCargando;
