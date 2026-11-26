import type { ITurno } from '../../../types/Turno.type';
import { agruparTurnosPorMes } from './agruparTurnosPorMes';
import styles from './EstadisticasSupervisor.module.scss';

interface GraficoTurnosPorMesProps {
  turnos: ITurno[];
  isLoading: boolean;
  titulo: string;
  idTitulo: string;
  estado?: ITurno['estado'];
  variante?: 'normal' | 'cancelados';
}

const GraficoTurnosPorMes = ({
  turnos,
  isLoading,
  titulo,
  idTitulo,
  estado,
  variante = 'normal',
}: GraficoTurnosPorMesProps) => {
  const { meses, total, sinFechaValida } = agruparTurnosPorMes(turnos, estado);
  const maximo = Math.max(...meses.map((mes) => mes.cantidad), 1);
  const claseBarra = variante === 'cancelados' ? styles.barraCancelados : styles.barraMes;

  return (
    <section className={styles.panel} aria-labelledby={idTitulo}>
      <h2 id={idTitulo} className={styles.titulo}>
        {titulo}
      </h2>
      <p className={styles.descripcion}>
        Total: {total} {total === 1 ? 'turno' : 'turnos'} según la fecha programada.
      </p>

      {isLoading ? (
        <p className={styles.estado}>Cargando estadísticas...</p>
      ) : (
        <>
          {sinFechaValida > 0 && (
            <p className={styles.estado} role="status">
              {sinFechaValida} {sinFechaValida === 1 ? 'turno tiene' : 'turnos tienen'} una fecha
              inválida y no se pudieron agrupar.
            </p>
          )}
          <div className={styles.grafico} role="list" aria-label={titulo}>
            {meses.map((mes) => (
              <div
                className={styles.columnaMes}
                key={mes.clave}
                role="listitem"
                aria-label={`${mes.etiqueta}: ${mes.cantidad} turnos`}
              >
                <span className={styles.valorMes}>{mes.cantidad}</span>
                <div className={styles.pistaBarra} aria-hidden="true">
                  <div
                    className={claseBarra}
                    style={{ height: `${(mes.cantidad / maximo) * 100}%` }}
                  />
                </div>
                <span className={styles.etiquetaMes}>{mes.etiqueta}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default GraficoTurnosPorMes;
