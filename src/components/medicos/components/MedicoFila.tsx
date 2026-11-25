// medicos/components/MedicoFila.tsx
import { Badge, Button } from 'react-bootstrap';
import type { IMedicoListado } from '../../../types/Medico.type';
import styles from '../ListadoMedicos.module.scss';

interface MedicoFilaProps {
  medico: IMedicoListado;
  onDetalle: (id: string) => void;
  onEditar: (id: string) => void;
  onAgenda: (id: string) => void;
  onEliminar: (medico: IMedicoListado) => void;
}

const MedicoFila = ({ medico, onDetalle, onEditar, onAgenda, onEliminar }: MedicoFilaProps) => {
  const { id, nombre, numeroMatricula, especialidad, agenda } = medico;
  const tieneAgenda = agenda !== null;

  return (
    <tr
      className={styles.filaClickeable}
      role="link"
      tabIndex={0}
      aria-label={`Ver detalle del médico ${nombre}`}
      onClick={() => onDetalle(id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onDetalle(id);
      }}
    >
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
        <div
          className={styles.acciones}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Button size="sm" variant={tieneAgenda ? 'outline-secondary' : 'primary'}
            onClick={() => onAgenda(id)}
          >
            {tieneAgenda ? 'Agenda' : 'Cargar agenda'}
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => onEditar(id)}>Editar</Button>
          <Button size="sm" variant="outline-danger" onClick={() => onEliminar(medico)}>Eliminar</Button>
        </div>
      </td>
    </tr>
  );
};

export default MedicoFila;