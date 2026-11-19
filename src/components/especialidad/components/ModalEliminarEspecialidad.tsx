import { Button, Modal } from "react-bootstrap";
import type { IEspecialidad } from "../../../types/Especialidad.type";

interface ModalEliminarEspecialidadProps {
    especialidad: IEspecialidad | null;
    eliminando: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
}

const ModalEliminarEspecialidad = ({
    especialidad,
    eliminando,
    onCancelar,
    onConfirmar,
}: ModalEliminarEspecialidadProps) => (
    <Modal show={especialidad !== null} onHide={onCancelar} centered>
        <Modal.Header closeButton>
            <Modal.Title>Eliminar especialidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            ¿Seguro que querés eliminar la especialidad{" "}
            <strong>{especialidad?.nombre}</strong>? Esta acción no se puede deshacer.
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

export default ModalEliminarEspecialidad;
