import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import type { ITurno } from '../../types/Turno.type';

interface ModalCancelarTurnoProps {
  turno: ITurno | null;
  onClose: () => void;
  onTurnoCancelado: (idTurno: string) => void;
}

const ModalCancelarTurno = ({
  turno,
  onClose,
  onTurnoCancelado,
}: ModalCancelarTurnoProps) => {
  const [cancelando, setCancelando] = useState(false);

  const cancelarTurno = async (): Promise<void> => {
    if (!turno) return;

    try {
      setCancelando(true);
      await clientesAxios.patch(`/turnos/cancelar/${turno.id}`, { estado: 'cancelado' });
      onTurnoCancelado(turno.id);
      toast.success('Turno cancelado');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cancelar el turno. Intentá nuevamente.');
    } finally {
      setCancelando(false);
    }
  };

  return (
    <Modal show={turno !== null} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cancelar turno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Confirmás la cancelación del turno de{' '}
        <strong>{turno?.pacienteId?.nombre ?? 'la persona'}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          disabled={cancelando}
          onClick={onClose}
        >
          Volver
        </Button>
        <Button
          variant="danger"
          disabled={cancelando}
          onClick={() => void cancelarTurno()}
        >
          {cancelando ? 'Cancelando...' : 'Confirmar cancelación'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCancelarTurno;
