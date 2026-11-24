import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import type { IUsuarioSistema } from '../../types/Usuario.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

interface ModalEliminarUsuarioProps {
  usuario: IUsuarioSistema | null;
  onCancelar: () => void;
  onEliminado: (id: string) => void;
}

const ModalEliminarUsuario = ({ usuario, onCancelar, onEliminado }: ModalEliminarUsuarioProps) => {
  const [eliminando, setEliminando] = useState(false);

  const confirmarEliminacion = async (): Promise<void> => {
    if (!usuario) return;
    const usuarioId = usuario._id ?? usuario.id;
    if (!usuarioId) {
      toast.error('No se pudo identificar al usuario.');
      return;
    }

    try {
      setEliminando(true);
      await clientesAxios.delete(`/auth/usuarios/${usuarioId}`);
      onEliminado(usuarioId);
      toast.success('Usuario eliminado.');
      onCancelar();
    } catch (error: unknown) {
      toast.error(obtenerMensajeError(error));
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Modal
      show={usuario !== null}
      onHide={() => {
        if (!eliminando) onCancelar();
      }}
      centered
    >
      <Modal.Header closeButton={!eliminando}>
        <Modal.Title>Eliminar usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Seguro que querés eliminar a <strong>{usuario?.user}</strong>? Esta acción no se puede deshacer.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancelar} disabled={eliminando}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => void confirmarEliminacion()} disabled={eliminando}>
          {eliminando ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarUsuario;
