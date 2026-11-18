import { Card, Spinner } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';
import { DiaSemana, type IAgenda } from '../../types/Agenda.types';

interface AtencionMedicoProps {
  medicoId: string;
}

const nombresDias: Record<DiaSemana, string> = {
  [DiaSemana.LUNES]: 'Lunes',
  [DiaSemana.MARTES]: 'Martes',
  [DiaSemana.MIERCOLES]: 'Miércoles',
  [DiaSemana.JUEVES]: 'Jueves',
  [DiaSemana.VIERNES]: 'Viernes',
  [DiaSemana.SABADO]: 'Sábado',
  [DiaSemana.DOMINGO]: 'Domingo',
};

const ordenDias = Object.values(DiaSemana);

const formatearHora = (hora: string): string => {
  const [horas, minutos] = hora.split(':');
  return `${Number(horas)}:${minutos}`;
};

const AtencionMedico = ({ medicoId }: AtencionMedicoProps) => {
  const { data: agenda, isLoading } = useFetch<IAgenda>(`/medicos/${medicoId}/agenda`);

  const dias = [...(agenda?.dias ?? [])].sort(
    (a, b) => ordenDias.indexOf(a.diaSemana) - ordenDias.indexOf(b.diaSemana),
  );

  return (
    <Card className="border-0 shadow-sm mb-4" aria-live="polite">
      <Card.Header className="bg-white fw-semibold">Atiende:</Card.Header>
      <Card.Body>
        {isLoading ? (
          <div className="d-flex align-items-center gap-2 text-body-secondary">
            <Spinner animation="border" size="sm" role="status">
              <span className="visually-hidden">Cargando agenda...</span>
            </Spinner>
            Cargando agenda...
          </div>
        ) : dias.length > 0 ? (
          <ul className="list-unstyled mb-0">
            {dias.map((dia) => (
              <li key={dia.diaSemana} className="mb-1">
                <span className="fw-semibold">{nombresDias[dia.diaSemana]}</span>
                {' de '}
                {dia.rangos
                  .map((rango) => `${formatearHora(rango.horaInicio)} a ${formatearHora(rango.horaFin)}`)
                  .join(' y de ')}
                {' hs'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-secondary mb-0">No hay una agenda registrada para este médico.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default AtencionMedico;
