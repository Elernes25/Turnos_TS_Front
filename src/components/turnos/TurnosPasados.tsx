import { useEffect, useRef, useState } from 'react';
import { Badge, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clientesAxios } from '../../config/axios';
import { useFetch } from '../../hooks/useFetch';
import type { ITurno } from '../../types/Turno.type';
import styles from './listadoTurnos.module.scss';

const TurnosPasados = () => {
  const navigate = useNavigate();
  const { data: turnos, setData: setTurnos, isLoading, refetch } = useFetch<ITurno[]>('/turnos');
  const [cancelandoPendientes, setCancelandoPendientes] = useState(false);
  const turnosProcesados = useRef(new Set<string>());

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const turnosPasados = [...(turnos ?? [])]
    .filter((turno) => {
      const fechaTurno = new Date(turno.fechaTurno);
      return !Number.isNaN(fechaTurno.getTime()) && fechaTurno < inicioHoy;
    })
    .sort((a, b) => new Date(b.fechaTurno).getTime() - new Date(a.fechaTurno).getTime());

  useEffect(() => {
    const pendientesPasados = turnosPasados.filter(
      (turno) => turno.estado === 'pendiente' && !turnosProcesados.current.has(turno.id)
    );

    if (pendientesPasados.length === 0) return;

    pendientesPasados.forEach((turno) => turnosProcesados.current.add(turno.id));
    setCancelandoPendientes(true);

    void Promise.all(pendientesPasados.map(async (turno) => {
      try {
        await clientesAxios.patch(`/turnos/cancelar/${turno.id}`, { estado: 'cancelado' });
        setTurnos((actuales) => (actuales ?? []).map((actual) =>
          actual.id === turno.id ? { ...actual, estado: 'cancelado' } : actual
        ));
      } catch (error) {
        console.error(error);
        toast.error(`No se pudo cancelar el turno de ${turno.pacienteId?.nombre ?? 'la persona'}.`);
      }
    }))
      .then(() => refetch())
      .finally(() => setCancelandoPendientes(false));
  }, [refetch, setTurnos, turnosPasados]);

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <h1>Turnos pasados</h1>
        <p>Consultá los turnos anteriores a hoy.</p>
      </div>

      {isLoading || cancelandoPendientes ? (
        <div className="py-5 text-center" role="status" aria-label="Cargando turnos pasados">
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
            </tr>
          </thead>
          <tbody>
            {turnosPasados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-muted">
                  No hay turnos pasados.
                </td>
              </tr>
            ) : (
              turnosPasados.map((turno) => {
                const fecha = new Date(turno.fechaTurno);
                const pendiente = turno.estado === 'pendiente';
                const enAtencion = turno.estado === 'en atencion';

                return (
                  <tr
                    key={turno.id}
                    className={styles.filaClickeable}
                    role="link"
                    tabIndex={0}
                    aria-label={`Ver detalle del turno de ${turno.pacienteId?.nombre ?? 'Paciente sin asignar'}`}
                    onClick={() => navigate(`/turno-detalle/${turno.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') navigate(`/turno-detalle/${turno.id}`);
                    }}
                  >
                    <td>{turno.pacienteId?.nombre ?? 'Paciente sin asignar'}</td>
                    <td>{turno.especialidadId?.nombre ?? 'Sin especialidad'}</td>
                    <td>{turno.medicoId?.nombre ?? 'Sin médico asignado'}</td>
                    <td>
                      {fecha.toLocaleDateString('es-AR')} ·{' '}
                      {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td>
                      <Badge
                        bg={
                          turno.estado === 'atendido'
                            ? 'success'
                            : turno.estado === 'cancelado'
                              ? 'secondary'
                              : enAtencion
                                ? 'info'
                                : 'warning'
                        }
                        text={pendiente || enAtencion ? 'dark' : undefined}
                      >
                        {pendiente
                          ? 'Pendiente'
                          : turno.estado === 'atendido'
                            ? 'Atendido'
                            : turno.estado === 'cancelado'
                              ? 'Cancelado'
                              : 'En atención'}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TurnosPasados;
