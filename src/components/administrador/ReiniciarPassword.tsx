import { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import type { IUsuarioSistema } from '../../types/Usuario.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import styles from './Usuarios.module.scss';

interface ReiniciarPasswordProps {
  usuario: IUsuarioSistema | null;
  onCerrar: () => void;
}

interface RespuestaPasswordTemporal {
  passwordTemporal?: unknown;
  datos?: {
    passwordTemporal?: unknown;
  };
}

const ReiniciarPassword = ({ usuario, onCerrar }: ReiniciarPasswordProps) => {
  const [passwordTemporal, setPasswordTemporal] = useState<string | null>(null);
  const [reiniciando, setReiniciando] = useState(false);

  useEffect(() => {
    setPasswordTemporal(null);
    setReiniciando(false);
  }, [usuario]);

  const reiniciarPassword = async (): Promise<void> => {
    if (!usuario) return;
    const usuarioId = usuario._id ?? usuario.id;
    if (!usuarioId) {
      toast.error('No se pudo identificar al usuario.');
      return;
    }

    try {
      setReiniciando(true);
      const respuesta = await clientesAxios.patch<RespuestaPasswordTemporal>(
        `/reiniciar-password/${usuarioId}/reiniciar-password`,
      );
      const password = respuesta.data?.passwordTemporal ?? respuesta.data?.datos?.passwordTemporal;
      if (typeof password !== 'string' || password.length === 0) {
        console.error('Respuesta inesperada al reiniciar el password:', respuesta.data);
        toast.error('El servidor no devolvió la contraseña temporal.');
        return;
      }
      setPasswordTemporal(password);
      toast.success('La contraseña fue reiniciada.');
    } catch (error: unknown) {
      console.error('No se pudo reiniciar el password:', error);
      toast.error(obtenerMensajeError(error));
    } finally {
      setReiniciando(false);
    }
  };

  const mostrarTicket = usuario !== null && passwordTemporal !== null;

  return (
    <>
      <Modal
        show={usuario !== null && !mostrarTicket}
        onHide={() => {
          if (!reiniciando) onCerrar();
        }}
        centered
      >
        <Modal.Header closeButton={!reiniciando}>
          <Modal.Title>Reiniciar password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Querés reiniciar el password de <strong>{usuario?.user}</strong>? Si aceptás, anotá
          la nueva contraseña y avisásela al usuario.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCerrar} disabled={reiniciando}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => void reiniciarPassword()} disabled={reiniciando}>
            {reiniciando ? 'Reiniciando...' : 'Reiniciar password'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={mostrarTicket}
        onHide={() => undefined}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Password reiniciado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.ticket}>
            <p><strong>Usuario:</strong> {usuario?.user}</p>
            <p><strong>DNI:</strong> {usuario?.dni}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
            <p><strong>Rol:</strong> {usuario?.rol}</p>
            <div className={styles.passwordTicket}>
              <span>Nuevo password</span>
              <strong>{passwordTemporal}</strong>
            </div>
            <Alert variant="warning" className="mb-0 mt-3">
              Anotá esta contraseña y comunicasela al usuario.
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onCerrar}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReiniciarPassword;
