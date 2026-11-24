import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { clientesAxios } from '../../../config/axios';
import type { IRecepcionistaListado } from '../../../types/Recepcionista.type';
import { obtenerMensajeError } from '../../utils/obtenerMensajeError';

interface ModalEliminarRecepcionistaProps {
  recepcionista: IRecepcionistaListado | null;
  onCancelar: () => void;
  onEliminado: (id: string) => void;
}

const ModalEliminarRecepcionista = ({
  recepcionista,
  onCancelar,
  onEliminado,
}: ModalEliminarRecepcionistaProps) => {
  const [eliminando, setEliminando] = useState(false);

  const confirmarEliminacion = async (): Promise<void> => {
    if (!recepcionista) return;

    try {
      setEliminando(true);
      await clientesAxios.delete(`/recepcionistas/${recepcionista.id}`);
      onEliminado(recepcionista.id);
      toast.success('Recepcionista eliminado.');
      onCancelar();
    } catch (error: unknown) {
      toast.error(obtenerMensajeError(error));
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Modal
      show={recepcionista !== null}
      onHide={() => {
        if (!eliminando) onCancelar();
      }}
      centered
    >
      <Modal.Header closeButton={!eliminando}>
        <Modal.Title>Borrar recepcionista</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Seguro que querés borrar a <strong>{recepcionista?.nombre}</strong>? Esta acción no se puede deshacer.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancelar} disabled={eliminando}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => void confirmarEliminacion()} disabled={eliminando}>
          {eliminando ? 'Borrando...' : 'Borrar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarRecepcionista;
