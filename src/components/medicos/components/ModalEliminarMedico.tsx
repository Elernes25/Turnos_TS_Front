// medicos/components/ModalEliminarMedico.tsx
import { Button, Modal } from 'react-bootstrap';
import type { IMedicoListado } from '../../../types/Medico.type';

interface ModalEliminarMedicoProps {
  medico: IMedicoListado | null; // null = modal cerrado
  eliminando: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

const ModalEliminarMedico = ({
  medico,
  eliminando,
  onCancelar,
  onConfirmar,
}: ModalEliminarMedicoProps) => (
  <Modal show={medico !== null} onHide={onCancelar} centered>
    <Modal.Header closeButton>
      <Modal.Title>Eliminar médico</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      ¿Seguro que querés eliminar a <strong>{medico?.nombre}</strong>? Se eliminará
      también su agenda. Esta acción no se puede deshacer.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onCancelar} disabled={eliminando}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirmar} disabled={eliminando}>
        {eliminando ? 'Eliminando...' : 'Eliminar'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalEliminarMedico;