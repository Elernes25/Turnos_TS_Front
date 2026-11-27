import type { ITurno } from '../../../types/Turno.type';
import styles from './EstadisticasSupervisor.module.scss';

interface RankingEspecialidadesProps {
  turnos: ITurno[];
  isLoading: boolean;
}

const RankingEspecialidades = ({ turnos, isLoading }: RankingEspecialidadesProps) => {
  const conteo = new Map<string, { nombre: string; cantidad: number }>();

  for (const turno of turnos) {
    const nombre = turno.especialidadId?.nombre.trim();
    if (!nombre) continue;

    const clave = nombre.toLocaleLowerCase('es');
    const actual = conteo.get(clave);
    if (actual) {
      actual.cantidad += 1;
    } else {
      conteo.set(clave, { nombre, cantidad: 1 });
    }
  }

  const ranking = [...conteo.values()]
    .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'))
    .slice(0, 5);
  const maximo = ranking[0]?.cantidad ?? 1;

  return (
    <section className={styles.panel} aria-labelledby="ranking-especialidades-titulo">
      <h2 id="ranking-especialidades-titulo" className={styles.titulo}>
        Especialidades más solicitadas
      </h2>
      <p className={styles.descripcion}>Top 5 por cantidad de turnos registrados.</p>

      {isLoading ? (
        <p className={styles.estado}>Cargando estadísticas...</p>
      ) : ranking.length === 0 ? (
        <p className={styles.estado}>No hay turnos para mostrar.</p>
      ) : (
        <ol className={styles.listaRanking}>
          {ranking.map((especialidad) => (
            <li className={styles.filaRanking} key={especialidad.nombre}>
              <div className={styles.datosRanking}>
                <span className={styles.nombreRanking}>{especialidad.nombre}</span>
                <span className={styles.cantidad}>{especialidad.cantidad}</span>
              </div>
              <div className={styles.fondoBarra} aria-hidden="true">
                <div
                  className={styles.barraRanking}
                  style={{ width: `${(especialidad.cantidad / maximo) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default RankingEspecialidades;
