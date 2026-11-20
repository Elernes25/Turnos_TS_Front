import { Button, Modal } from "react-bootstrap";
import type { IObraSocial } from "../../types/ObraSocial.type";

interface ModalEliminarObraSocialProps {
    obraSocial: IObraSocial | null;
    eliminando: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
}

const ModalEliminarObraSocial = ({
    obraSocial,
    eliminando,
    onCancelar,
    onConfirmar,
}: ModalEliminarObraSocialProps) => (
    <Modal show={obraSocial !== null} onHide={onCancelar} centered>
        <Modal.Header closeButton>
            <Modal.Title>Eliminar obra social</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            ¿Seguro que querés eliminar la obra social{" "}
            <strong>{obraSocial?.nombreObraSocial}</strong>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={onCancelar} disabled={eliminando}>
                Cancelar
            </Button>
            <Button variant="danger" onClick={onConfirmar} disabled={eliminando}>
                {eliminando ? "Eliminando..." : "Eliminar"}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ModalEliminarObraSocial;
