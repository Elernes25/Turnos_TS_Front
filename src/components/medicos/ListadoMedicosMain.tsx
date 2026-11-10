import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import { medicosListadoSchema, type IMedicoListado} from '../../types/Medico.type';

import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import MedicoFila from './components/MedicoFila';
import ModalEliminarMedico from './components/ModalEliminarMedico';
import styles from './ListadoMedicos.module.scss';

//elimina los acentos (tildes) y diéresis de un texto, y lo convierte por completo a letras minúsculas
const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const ListadoMedicosMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [medicos, setMedicos] = useState<IMedicoListado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medicoAEliminar, setMedicoAEliminar] =
    useState<IMedicoListado | null>(null);

  const [eliminando, setEliminando] = useState(false);

  const cargarMedicos = async (): Promise<void> => {
    try {
      setCargando(true);
      setError(null);

      const { data } = await clientesAxios.get('/medicos/conAgenda');
      // para depurar
     // console.log(JSON.stringify(data.datos, null, 2));
     // const resultado = medicosListadoSchema.safeParse(data.datos);
     // if (!resultado.success) {
     //     console.log(resultado.error.issues);
     // }
      // fin para depurar

      setMedicos(medicosListadoSchema.parse(data.datos));

    } catch (error:any) {
      setError(obtenerMensajeError(error));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarMedicos();
  }, []);

  const medicosFiltrados = useMemo(() => {
    const termino = normalizar(busqueda.trim());

    if (!termino) return medicos;

    return medicos.filter(
      (medico) =>
        normalizar(medico.nombre).includes(termino) ||
        normalizar(medico.numeroMatricula).includes(termino)
    );
  }, [medicos, busqueda]);

  const confirmarEliminacion = async (): Promise<void> => {
    if (!medicoAEliminar) return;

    try {
      setEliminando(true);
      await clientesAxios.delete(`/medicos/${medicoAEliminar.id}`);
      setMedicos((prev) =>
        prev.filter((m) => m.id !== medicoAEliminar.id)
      );

      toast.success('Médico eliminado');
      setMedicoAEliminar(null);
    } catch (error) {
      toast.error(obtenerMensajeError(error));
    } finally {
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="danger"
        className="d-flex justify-content-between align-items-center"
      >
        <span>{error}</span>

        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => void cargarMedicos()}
        >
          Reintentar
        </Button>
      </Alert>
    );
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <div>
          <h1>Médicos</h1>
          <p>Listado de médicos cargados en el sistema.</p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/nuevo-medico',{state: {from: location.pathname}})}
        >
          + Nuevo médico
        </Button>
      </div>

      <Form.Control
        type="search"
        placeholder="Buscar por nombre o matrícula"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <Table responsive hover className={styles.tabla}>
        <thead>
          <tr>
            <th>Médico</th>
            <th>Especialidades</th>
            <th>Matrícula</th>
            <th>Agenda</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {medicosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                No se encontraron médicos.
              </td>
            </tr>
          ) : (
            medicosFiltrados.map((medico) => (
              <MedicoFila
                key={medico.id}
                medico={medico}
                onEditar={(id) => {console.log(`/medicos/${id}/editar`); navigate(`/medicos/${id}/editar`)}}
                onAgenda={(id) => navigate(`/medicos/${id}/agenda`)} //supervisor-agenda
                onEliminar={setMedicoAEliminar}
              />
            ))
          )}
        </tbody>
      </Table>

      <ModalEliminarMedico
        medico={medicoAEliminar}
        eliminando={eliminando}
        onCancelar={() => setMedicoAEliminar(null)}
        onConfirmar={() => void confirmarEliminacion()}
      />
    </div>
  );
};

export default ListadoMedicosMain;