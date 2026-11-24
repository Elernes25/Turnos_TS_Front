import { useState } from 'react';
import { Badge, Button, Card, Modal, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import type { ITurno } from '../../types/Turno.type';
import styles from './listadoTurnos.module.scss';

interface TurnosHoyProps {
  turnos: ITurno[];
  isLoading: boolean;
  onAtender: (idTurno: string) => void;
  onTurnoCancelado: (idTurno: string) => void;
}

const TurnosHoy = ({ turnos, isLoading, onAtender, onTurnoCancelado }: TurnosHoyProps) => {
  const [turnoACancelar, setTurnoACancelar] = useState<ITurno | null>(null);
  const [turnoEnProceso, setTurnoEnProceso] = useState<string | null>(null);
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const inicioManana = new Date(inicioHoy);
  inicioManana.setDate(inicioManana.getDate() + 1);

  const turnosDeHoy = [...turnos]
    .filter((turno) => {
      const fecha = new Date(turno.fechaTurno);
      return fecha >= inicioHoy && fecha < inicioManana;
    })
    .sort((a, b) => new Date(a.fechaTurno).getTime() - new Date(b.fechaTurno).getTime());

  const cancelarTurno = async (): Promise<void> => {
    if (!turnoACancelar) return;

    try {
      setTurnoEnProceso(turnoACancelar.id);
      await clientesAxios.patch(`/turnos/cancelar/${turnoACancelar.id}`, { estado: 'cancelado' });
      onTurnoCancelado(turnoACancelar.id);
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
    <Card className="border-1 shadow-sm">
      <Card.Header className="bg-white fw-semibold">Turnos de hoy</Card.Header>
      <Card.Body className="pt-1">
        {isLoading ? (
          <div className="py-4 text-center" role="status" aria-label="Cargando turnos de hoy">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive hover className={`${styles.tabla} ${styles.tablaTurnosHoy}`}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Especialidad</th>
                <th>Médico</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnosDeHoy.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted">
                    No hay turnos para hoy.
                  </td>
                </tr>
              ) : (
                turnosDeHoy.map((turno) => {
                  const fecha = new Date(turno.fechaTurno);
                  const pendiente = turno.estado === 'pendiente';

                  return (
                    <tr key={turno.id}>
                      <td>{turno.pacienteId?.nombre ?? 'Paciente sin asignar'}</td>
                      <td>{turno.especialidadId?.nombre ?? 'Sin especialidad'}</td>
                      <td>{turno.medicoId?.nombre ?? 'Sin médico asignado'}</td>
                      <td>
                        {fecha.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </td>
                      <td>
                        <Badge
                          bg={turno.estado === 'atendido' ? 'success' : turno.estado === 'cancelado' ? 'secondary' : 'warning'}
                          text={pendiente ? 'dark' : undefined}
                        >
                          {turno.estado === 'pendiente'
                            ? 'Pendiente'
                            : turno.estado === 'atendido'
                              ? 'Atendido'
                              : 'Cancelado'}
                        </Badge>
                      </td>
                      <td>
                        <div className={styles.acciones}>
                          <Button
                            size="sm"
                            disabled={!pendiente}
                            onClick={() => onAtender(turno.id)}
                          >
                            Llamar
                          </Button>
                          {pendiente ? (
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
                          )}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={!pendiente || turnoEnProceso === turno.id}
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
      </Card.Body>

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
    </Card>
  );
};

export default TurnosHoy;
