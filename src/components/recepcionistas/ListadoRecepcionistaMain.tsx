import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { PersonPlus } from 'react-bootstrap-icons';
import { toast } from 'sonner';
import { useFetch } from '../../hooks/useFetch';
import { recepcionistasListadoSchema, type IRecepcionistaListado} from '../../types/Recepcionista.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import styles from '../medicos/ListadoMedicos.module.scss';
import ModalEliminarRecepcionista from './components/ModalEliminarRecepcionista';

const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const formatearTelefono = (telefono: IRecepcionistaListado['telefono']): string =>
  `+${telefono.codigoPais} ${telefono.codigoArea} ${telefono.numero}`;

const ListadoRecepcionistaMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading: cargando } = useFetch<unknown>('/recepcionistas');
  const [recepcionistas, setRecepcionistas] = useState<IRecepcionistaListado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [recepcionistaAEliminar, setRecepcionistaAEliminar] =
    useState<IRecepcionistaListado | null>(null);

  useEffect(() => {
    if (cargando) return;
    if (data === null) { 
      setErrorCarga('No fue posible cargar los recepcionistas.');
      return;
    }

    const resultado = recepcionistasListadoSchema.safeParse(data);
    if (!resultado.success) {
      const mensaje = obtenerMensajeError(resultado.error);
      setErrorCarga(mensaje);
      toast.error(mensaje);
      return;
    }

    setRecepcionistas(resultado.data);
    setErrorCarga(null);
  }, [cargando, data]);

  const recepcionistasFiltrados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    if (!termino) return recepcionistas;

    return recepcionistas.filter((recepcionista) =>
      normalizar(recepcionista.nombre).includes(termino)
      || normalizar(recepcionista.dni).includes(termino)
      || normalizar(formatearTelefono(recepcionista.telefono)).includes(termino),
    );
  }, [recepcionistas, busqueda]);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando recepcionistas...</span>
        </Spinner>
      </div>
    );
  }

  if (errorCarga) { return <Alert variant="danger">{errorCarga}</Alert>; }

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <div>
          <h1>Recepcionistas</h1>
          <p>Listado de recepcionistas cargados en el sistema.</p>
        </div>

        <Button variant="primary"
          onClick={() => navigate('/nuevo-recepcionista', { state: { from: location.pathname } })}
        >
          <PersonPlus aria-hidden="true" className="me-1" />
          Nuevo recepcionista
        </Button>
      </div>

      <Form.Control
        className="mb-3"
        type="search"
        placeholder="Buscar por nombre, DNI o teléfono"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      <Table responsive hover className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recepcionistasFiltrados.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted py-4">
                No se encontraron recepcionistas.
              </td>
            </tr>
          ) : (
            recepcionistasFiltrados.map((recepcionista) => (
              <tr
                key={recepcionista.id}
                className={styles.filaClickeable}
                role="link"
                tabIndex={0}
                aria-label={`Ver detalle de ${recepcionista.nombre}`}
                onClick={() => navigate(`/recepcionista-detalle/${recepcionista.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    navigate(`/recepcionista-detalle/${recepcionista.id}`);
                  }
                }}
              >
                <td><strong>{recepcionista.nombre}</strong></td>
                <td>{recepcionista.dni}</td>
                <td>{formatearTelefono(recepcionista.telefono)}</td>
                <td>
                  <div
                    className={styles.acciones}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    {/*<Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => navigate(`/recepcionista-detalle/${recepcionista.id}`)}
                    >
                      Detalles
                    </Button>*/}
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => navigate(`/recepcionista/${recepcionista.id}/editar`, {
                        state: { from: location.pathname },
                      })}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => setRecepcionistaAEliminar(recepcionista)}
                    >
                      Borrar
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <ModalEliminarRecepcionista
        recepcionista={recepcionistaAEliminar}
        onCancelar={() => setRecepcionistaAEliminar(null)}
        onEliminado={(id) =>
          setRecepcionistas((actuales) =>
            actuales.filter((recepcionista) => recepcionista.id !== id),
          )
        }
      />
    </div>
  );
};

export default ListadoRecepcionistaMain;