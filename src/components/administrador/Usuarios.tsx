import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { toast } from 'sonner';
import { getSession } from '../../auth/session';
import { clientesAxios } from '../../config/axios';
import { RolUsuario, type IUsuarioSistema } from '../../types/Usuario.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import styles from '../medicos/ListadoMedicos.module.scss';
import ModalEliminarUsuario from './ModalEliminarUsuario';
import ReiniciarPassword from './ReiniciarPassword';

interface RespuestaUsuarios {
  datos: IUsuarioSistema[];
}

const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const obtenerIdUsuario = (usuario: IUsuarioSistema): string | undefined =>
  usuario._id ?? usuario.id;

const Usuarios = () => {
  const session = getSession();
  const [usuarios, setUsuarios] = useState<IUsuarioSistema[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<IUsuarioSistema | null>(null);
  const [usuarioAReiniciar, setUsuarioAReiniciar] = useState<IUsuarioSistema | null>(null);

  useEffect(() => {
    const cargarUsuarios = async (): Promise<void> => {
      try {
        const respuesta = await clientesAxios.get<RespuestaUsuarios>('/auth/usuarios');
        setUsuarios(respuesta.data.datos ?? []);
      } catch (error: unknown) {
        const mensaje = obtenerMensajeError(error);
        setErrorCarga(mensaje);
        toast.error(mensaje);
      } finally {
        setCargando(false);
      }
    };

    void cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    const usuariosVisibles = usuarios.filter((usuario) =>
      usuario.rol !== RolUsuario.ADMIN
      && obtenerIdUsuario(usuario) !== session?.id
      && normalizar(usuario.user) !== normalizar(session?.user ?? ''),
    );
    if (!termino) return usuariosVisibles;

    return usuariosVisibles.filter((usuario) =>
      normalizar(usuario.dni).includes(termino)
      || normalizar(usuario.user).includes(termino),
    );
  }, [busqueda, session?.id, session?.user, usuarios]);

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado2}>
        <h1>Usuarios</h1>
        <p>Usuarios registrados en el sistema.</p>
      </div>

      <Form.Control
        className="mb-3"
        type="search"
        placeholder="Buscar por DNI o nombre de usuario"
        aria-label="Buscar usuario por DNI o nombre de usuario"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando usuarios...</span>
          </Spinner>
        </div>
      ) : errorCarga ? (
        <Alert variant="danger">{errorCarga}</Alert>
      ) : (
        <Table responsive hover className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre de usuario</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <tr key={obtenerIdUsuario(usuario) ?? `${usuario.user}-${usuario.dni}`}>
                  <td><strong>{usuario.user}</strong></td>
                  <td>{usuario.dni}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <div className={styles.acciones}>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => setUsuarioAEliminar(usuario)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => setUsuarioAReiniciar(usuario)}
                      >
                        Reiniciar password
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <ModalEliminarUsuario
        usuario={usuarioAEliminar}
        onCancelar={() => setUsuarioAEliminar(null)}
        onEliminado={(id) => setUsuarios((actuales) =>
          actuales.filter((usuario) => obtenerIdUsuario(usuario) !== id))}
      />
      <ReiniciarPassword
        usuario={usuarioAReiniciar}
        onCerrar={() => setUsuarioAReiniciar(null)}
      />
    </div>
  );
};

export default Usuarios;
