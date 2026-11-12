import { useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';
import type { IMedico } from '../../types/Medico.type';
import styles from './ListadoMedicos.module.scss';

const ListadoMedicos = () => {
  const navigate = useNavigate();
  const { data: medicos, isLoading } = useFetch<IMedico[]>('/medicos');

  return (
    <Container>
      <h1 className="mb-4">Médicos</h1>

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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!medicos || medicos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No se encontraron médicos.
                </td>
              </tr>
            ) : (
              medicos.map((medico) => (
                <tr key={medico.id}>
                  <td><strong>{medico.nombre}</strong></td>
                  <td>{medico.especialidad.map((especialidad) => especialidad.nombre).join(', ') || 'Sin especialidades'}</td>
                  <td>MP {medico.numeroMatricula}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/medico-detalle/${medico.id}`)}
                    >
                      Detalle
                    </Button>
                  </td>
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
