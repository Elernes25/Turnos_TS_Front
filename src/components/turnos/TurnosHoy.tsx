import { useState } from 'react';
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ITurno } from '../../types/Turno.type';
import styles from './listadoTurnos.module.scss';
import ModalCancelarTurno from './ModalCancelarTurno';

interface TurnosHoyProps {
  turnos: ITurno[];
  isLoading: boolean;
  onAtender: (idTurno: string) => void;
  onTurnoCancelado: (idTurno: string) => void;
}

const TurnosHoy = ({ turnos, isLoading, onAtender, onTurnoCancelado }: TurnosHoyProps) => {
  const [turnoACancelar, setTurnoACancelar] = useState<ITurno | null>(null);
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
                        {fecha.toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit', hour12: false,})}
                      </td>
                      <td>
                        <Badge
                          bg={turno.estado === 'atendido' ? 'success' : turno.estado === 'cancelado' ? 'secondary' : 'warning'}
                          text={pendiente ? 'dark' : undefined}
                        >
                          {turno.estado === 'pendiente'
                            ? 'Pendiente'
                            : turno.estado === 'atendido' ? 'Atendido' : 'Cancelado'}
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
                          {/*   suspendo el boton editar, el turno no se edita se cancela y se crea otro
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
                          ) */}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={!pendiente}
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

      <ModalCancelarTurno
        turno={turnoACancelar}
        onClose={() => setTurnoACancelar(null)}
        onTurnoCancelado={onTurnoCancelado}
      />
    </Card>
  );
};

export default TurnosHoy;
