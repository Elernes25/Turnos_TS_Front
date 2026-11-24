import { useState } from 'react';
import { Badge, Button, Modal, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import { useFetch } from '../../hooks/useFetch';
import type { ITurno } from '../../types/Turno.type';
import styles from '../turnos/listadoTurnos.module.scss';

const TurnosFuturos = () => {
  const { data: turnos, setData: setTurnos, isLoading } = useFetch<ITurno[]>('/turnos');
  const [turnoACancelar, setTurnoACancelar] = useState<ITurno | null>(null);
  const [turnoEnProceso, setTurnoEnProceso] = useState<string | null>(null);

  const inicioManana = new Date();
  inicioManana.setHours(0, 0, 0, 0);
  inicioManana.setDate(inicioManana.getDate() + 1);

  const turnosFuturos = [...(turnos ?? [])]
    .filter((turno) => {
      const fechaTurno = new Date(turno.fechaTurno);
      return !Number.isNaN(fechaTurno.getTime()) && fechaTurno >= inicioManana;
    })
    .sort((a, b) => new Date(a.fechaTurno).getTime() - new Date(b.fechaTurno).getTime());

  const cancelarTurno = async (): Promise<void> => {
    if (!turnoACancelar) return;

    try {
      setTurnoEnProceso(turnoACancelar.id);
      await clientesAxios.patch(`/turnos/cancelar/${turnoACancelar.id}`, { estado: 'cancelado' });
      setTurnos((actuales) => (actuales ?? []).map((turno) =>
        turno.id === turnoACancelar.id ? { ...turno, estado: 'cancelado' } : turno
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
        <h1>Turnos futuros</h1>
        <p>Consultá y gestioná los turnos a partir de mañana.</p>
      </div>

      {isLoading ? (
        <div className="py-5 text-center" role="status" aria-label="Cargando turnos futuros">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table responsive hover className={styles.tabla}>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Especialidad</th>
              <th>Médico</th>
              <th>Fecha y hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosFuturos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-muted">
                  No hay turnos futuros.
                </td>
              </tr>
            ) : (
              turnosFuturos.map((turno) => {
                const fecha = new Date(turno.fechaTurno);
                const pendiente = turno.estado === 'pendiente';
                const estaEnProceso = turnoEnProceso === turno.id;

                return (
                  <tr key={turno.id}>
                    <td>{turno.pacienteId?.nombre ?? 'Paciente sin asignar'}</td>
                    <td>{turno.especialidadId?.nombre ?? 'Sin especialidad'}</td>
                    <td>{turno.medicoId?.nombre ?? 'Sin médico asignado'}</td>
                    <td>
                      {fecha.toLocaleDateString('es-AR')} ·{' '}
                      {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td>
                      <Badge
                        bg={turno.estado === 'atendido' ? 'success' : turno.estado === 'cancelado' ? 'secondary' : 'warning'}
                        text={pendiente ? 'dark' : undefined}
                      >
                        {pendiente ? 'Pendiente' : turno.estado === 'atendido' ? 'Atendido' : 'Cancelado'}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.acciones}>
                        {/*  el turno se cancela y se crea
                        pendiente ? (
                          <Link
                            to={`/nuevo-turno?editar=${turno.id}`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Editar
                          </Link>
                        ) : (
                          <Button size="sm" variant="outline-secondary" disabled>
                            Editar
                          </Button>
                        )*/}
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={!pendiente || estaEnProceso}
                          onClick={() => setTurnoACancelar(turno)}
                        >
                          Cancelar
                        </Button>
                        <Link
                          to={`/turno-detalle/${turno.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Detalle
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
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

export default TurnosFuturos;
