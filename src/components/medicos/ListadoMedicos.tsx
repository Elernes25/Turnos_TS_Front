import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';
import type { IMedico } from '../../types/Medico.type';
import BuscadorMedicos from './components/BuscadorMedicos';
import styles from './ListadoMedicos.module.scss';

const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const ListadoMedicos = () => {
  const navigate = useNavigate();
  const { data: medicos, isLoading } = useFetch<IMedico[]>('/medicos');
  const [busqueda, setBusqueda] = useState('');
  const medicosFiltrados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    if (!termino) return medicos ?? [];

    return (medicos ?? []).filter((medico) =>
      normalizar(medico.nombre).includes(termino)
      || medico.especialidad.some((especialidad) => normalizar(especialidad.nombre).includes(termino))
    );
  }, [busqueda, medicos]);

  return (
    <Container>
      <div className={styles.encabezado2}>
        <h1 >Listado de Médicos</h1> 
        <p>Listado de médicos cargados en el sistema.</p>
     </div>
      {!isLoading && (
        <BuscadorMedicos valor={busqueda} alCambiar={setBusqueda} />
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando médicos...</span>
          </Spinner>
        </div>
      ) : (
        <Table responsive hover className={styles.tabla}>
          <thead>
            <tr>
              <th>Médico</th>
              <th>Especialidades</th>
              <th>Matrícula</th>
              {/* <th>Acciones</th> */}
            </tr>
          </thead>
          <tbody>
            {medicosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No se encontraron médicos.
                </td>
              </tr>
            ) : (
              medicosFiltrados.map((medico) => (
                <tr
                  key={medico.id}
                  className={styles.filaClickeable}
                  role="link"
                  tabIndex={0}
                  aria-label={`Ver detalle del médico ${medico.nombre}`}
                  onClick={() => navigate(`/medico-detalle/${medico.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/medico-detalle/${medico.id}`);
                  }}
                >
                  <td><strong>{medico.nombre}</strong></td>
                  <td>{medico.especialidad.map((especialidad) => especialidad.nombre).join(', ') || 'Sin especialidades'}</td>
                  <td>MP {medico.numeroMatricula}</td>
                 {/* <td>
                    
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/medico-detalle/${medico.id}`);
                      }}
                    >
                      Detalle
                    </Button>
                    
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ListadoMedicos;
