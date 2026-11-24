// medicos/components/MedicoFila.tsx
import { Badge, Button } from 'react-bootstrap';
import type { IMedicoListado } from '../../../types/Medico.type';
import styles from '../ListadoMedicos.module.scss';

interface MedicoFilaProps {
  medico: IMedicoListado;
  onEditar: (id: string) => void;
  onAgenda: (id: string) => void;
  onEliminar: (medico: IMedicoListado) => void;
}

const MedicoFila = ({ medico, onEditar, onAgenda, onEliminar }: MedicoFilaProps) => {
  const { id, nombre, numeroMatricula, especialidad, agenda } = medico;
  const tieneAgenda = agenda !== null;

  return (
    <tr>
      <td><strong>{nombre}</strong></td>
      <td>{especialidad.map((e) => e.nombre).join(', ')}</td>
      <td>MP {numeroMatricula}</td>
      <td>
        {tieneAgenda ? (
          <Badge bg="success">Agenda · turnos de { agenda!.duracionTurnoMinutos} min</Badge>
        ) : (
          <Badge bg="warning" text="dark">Sin agenda · no asignable a turnos</Badge>
        )}
      </td>
      <td>
        <div className={styles.acciones}>
          <Button
            variant={tieneAgenda ? 'outline-secondary' : 'primary'}
            onClick={() => onAgenda(id)}
          >
            {tieneAgenda ? 'Agenda' : 'Cargar agenda'}
          </Button>
          <Button variant="outline-secondary" onClick={() => onEditar(id)}>Editar</Button>
          <Button variant="outline-danger" onClick={() => onEliminar(medico)}>Eliminar</Button>
        </div>
      </td>
    </tr>
  );
};

export default MedicoFila;