import type { ITurno } from '../../../types/Turno.type';
import styles from './EstadisticasSupervisor.module.scss';

interface RankingMedicosProps {
  turnos: ITurno[];
  isLoading: boolean;
}

const RankingMedicos = ({ turnos, isLoading }: RankingMedicosProps) => {
  const conteo = new Map<string, { id: string; nombre: string; cantidad: number }>();

  for (const turno of turnos) {
    const medico = turno.medicoId;
    if (!medico?.id || !medico.nombre.trim()) continue;

    const actual = conteo.get(medico.id);
    if (actual) {
      actual.cantidad += 1;
    } else {
      conteo.set(medico.id, { id: medico.id, nombre: medico.nombre, cantidad: 1 });
    }
  }

  const ranking = [...conteo.values()]
    .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'))
    .slice(0, 5);
  const maximo = ranking[0]?.cantidad ?? 1;

  return (
    <section className={styles.panel} aria-labelledby="ranking-medicos-titulo">
      <h2 id="ranking-medicos-titulo" className={styles.titulo}>
        Médicos con más turnos
      </h2>
      <p className={styles.descripcion}>Top 5 por cantidad de turnos registrados.</p>

      {isLoading ? (
        <p className={styles.estado}>Cargando estadísticas...</p>
      ) : ranking.length === 0 ? (
        <p className={styles.estado}>No hay turnos con médico asignado.</p>
      ) : (
        <ol className={styles.listaRanking}>
          {ranking.map((medico) => (
            <li className={styles.filaRanking} key={medico.id}>
              <div className={styles.datosRanking}>
                <span className={styles.nombreRanking}>{medico.nombre}</span>
                <span className={styles.cantidad}>{medico.cantidad}</span>
              </div>
              <div className={styles.fondoBarra} aria-hidden="true">
                <div
                  className={styles.barraRanking}
                  style={{ width: `${(medico.cantidad / maximo) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default RankingMedicos;
