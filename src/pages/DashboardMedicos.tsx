import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import type { ITurno } from '../types/Turno.type';
import styles from '../components/recepcionistas/DashboardRecepcion.module.scss';

const DashboardMedicos = () => {
  const { data: turnos, isLoading } = useFetch<ITurno[]>('/turnos');
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const inicioManana = new Date(inicioHoy);
  inicioManana.setDate(inicioManana.getDate() + 1);

  const turnosDeHoy = (turnos ?? [])
    .filter((turno) => {
      const fecha = new Date(turno.fechaTurno);
      return fecha >= inicioHoy && fecha < inicioManana;
    })
    .sort((a, b) => new Date(a.fechaTurno).getTime() - new Date(b.fechaTurno).getTime());

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Dashboard Médico</h1>
          <p className={styles.subtitulo}>Turnos de pacientes del día</p>
        </div>
      </header>

      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>Turnos de hoy</h2>
        {isLoading ? (
          <div className="py-4 text-center" role="status" aria-label="Cargando turnos">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive hover className="align-middle mb-0">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnosDeHoy.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-muted">
                    No hay turnos para hoy.
                  </td>
                </tr>
              ) : (
                turnosDeHoy.map((turno) => {
                  const paciente = turno.pacienteId;
                  const fecha = new Date(turno.fechaTurno);

                  return (
                    <tr key={turno.id}>
                      <td>{paciente?.nombre ?? 'Paciente sin asignar'}</td>
                      <td>
                        {fecha.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </td>
                      <td>
                        {paciente && turno.estado !== 'atendido' ? (
                          <Link
                            to={`/historia-clinica/${paciente.id}`}
                            state={{ pacienteNombre: paciente.nombre, turnoId: turno.id }}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Historia Clínica
                          </Link>
                        ) : (
                          <Button size="sm" variant="outline-primary" disabled>
                            Historia Clínica
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </section>
    </Container>
  );
};

export default DashboardMedicos;
