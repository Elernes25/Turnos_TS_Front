import { useMemo, useState } from 'react';
import { Alert, Badge, Button, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import { useFetch } from '../../hooks/useFetch';
import type { ITurno } from '../../types/Turno.type';
import styles from './listadoTurnos.module.scss';

type FiltroFecha = 'pasados' | 'hoy' | 'futuros';

const inicioDelDia = (fecha: Date): Date =>
  new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

const ListadoTurnos = () => {
  const { data: turnos, setData: setTurnos, isLoading } = useFetch<ITurno[]>('/turnos');
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('hoy');
  const [turnoACancelar, setTurnoACancelar] = useState<ITurno | null>(null);
  const [turnoEnProceso, setTurnoEnProceso] = useState<string | null>(null);

  const turnosFiltrados = useMemo(() => {
    const hoy = inicioDelDia(new Date()).getTime();

    return [...(turnos ?? [])]
      .filter((turno) => {
        const fechaTurno = new Date(turno.fechaTurno);
        if (Number.isNaN(fechaTurno.getTime())) return false;

        const diaTurno = inicioDelDia(fechaTurno).getTime();
        if (filtroFecha === 'pasados') return diaTurno < hoy;
        if (filtroFecha === 'futuros') return diaTurno > hoy;
        return diaTurno === hoy;
      })
      .sort((a, b) => {
        const diferencia = new Date(a.fechaTurno).getTime() - new Date(b.fechaTurno).getTime();
        return filtroFecha === 'pasados' ? -diferencia : diferencia;
      });
  }, [turnos, filtroFecha]);

  const llamarTurno = async (turno: ITurno): Promise<void> => {
    try {
      setTurnoEnProceso(turno.id);
      await clientesAxios.patch(`/turnos/${turno.id}`);
      setTurnos((turnos ?? []).map((actual) =>
        actual.id === turno.id ? { ...actual, estado: 'atendido' } : actual
      ));
      toast.success(`Se llamó a ${turno.pacienteId?.nombre ?? 'la persona'}`);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo llamar a la persona. Intentá nuevamente.');
    } finally {
      setTurnoEnProceso(null);
    }
  };

  const cancelarTurno = async (): Promise<void> => {
    if (!turnoACancelar) return;

    try {
      setTurnoEnProceso(turnoACancelar.id);
      await clientesAxios.patch(`/turnos/${turnoACancelar.id}`, { estado: 'cancelado' });
      setTurnos((turnos ?? []).map((actual) =>
        actual.id === turnoACancelar.id ? { ...actual, estado: 'cancelado' } : actual
      ));
      toast.success('Turno cancelado');
      setTurnoACancelar(null);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cancelar el turno. Intentá nuevamente.');
    } finally {
      setTurnoEnProceso(null);
    }
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <h1>Turnos</h1>
        <p>Consultá y gestioná los turnos por fecha.</p>
      </div>

      <Form.Group className={styles.filtros} controlId="filtroFechaTurnos">
        <Form.Label>Mostrar turnos</Form.Label>
        <Form.Select
          value={filtroFecha}
          onChange={(evento) => setFiltroFecha(evento.target.value as FiltroFecha)}
        >
          <option value="pasados">Pasados</option>
          <option value="hoy">De Hoy</option>
          <option value="futuros">Futuros</option>
        </Form.Select>
      </Form.Group>

      {isLoading ? (
        <div className="py-5 text-center" role="status" aria-label="Cargando turnos">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table responsive hover className={styles.tabla}>
          <thead>
            <tr>
              <th>Persona</th>
              <th>Especialidad</th>
              <th>Médico</th>
              <th>Fecha y hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-muted">
                  No hay turnos para el período seleccionado.
                </td>
              </tr>
            ) : (
              turnosFiltrados.map((turno) => {
                const fecha = new Date(turno.fechaTurno);
                const estaEnProceso = turnoEnProceso === turno.id;
                const noPendiente = turno.estado !== 'pendiente';

                return (
                  <tr key={turno.id}>
                    <td>{turno.pacienteId?.nombre ?? 'Persona sin asignar'}</td>
                    <td>{turno.especialidadId?.nombre ?? 'Sin especialidad'}</td>
                    <td>{turno.medicoId?.nombre ?? 'Sin médico asignado'}</td>
                    <td>
                      {fecha.toLocaleDateString('es-AR')} ·{' '}
                      {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false,})}
                    </td>
                    <td>
                      <Badge
                        bg={turno.estado === 'atendido' ? 'success' : turno.estado === 'cancelado' ? 'secondary' : 'warning'}
                        text={turno.estado === 'pendiente' ? 'dark' : undefined}
                      >
                        {turno.estado === 'pendiente' ? 'Pendiente' : turno.estado === 'atendido' ? 'Atendido' : 'Cancelado'}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.acciones}>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={noPendiente || estaEnProceso}
                          onClick={() => void llamarTurno(turno)}
                        >
                          Llamar
                        </Button>
                        <Button size="sm" variant="outline-secondary" disabled title="Disponible próximamente">
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={noPendiente || estaEnProceso}
                          onClick={() => setTurnoACancelar(turno)}
                        >
                          Cancelar
                        </Button>
                        <Link to="/turno-detalle/${turno.id}" className="btn btn-outline-secondary mt-4">Detalle</Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}

      {!isLoading && !turnos && (
        <Alert variant="info" className="mt-3">
          No hay turnos disponibles.
        </Alert>
      )}

      <Modal show={turnoACancelar !== null} onHide={() => setTurnoACancelar(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Confirmás la cancelación del turno de{' '}
          <strong>{turnoACancelar?.pacienteId?.nombre ?? 'la persona'}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={turnoEnProceso !== null}
            onClick={() => setTurnoACancelar(null)}
          >
            Volver
          </Button>
          <Button
            variant="danger"
            disabled={turnoEnProceso !== null}
            onClick={() => void cancelarTurno()}
          >
            {turnoEnProceso === turnoACancelar?.id ? 'Cancelando...' : 'Confirmar cancelación'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListadoTurnos;