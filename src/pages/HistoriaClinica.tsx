import { useState, type SubmitEvent } from 'react';
import { Alert, Button, Card, Container, Form, ListGroup, Spinner } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useFetch } from '../hooks/useFetch';
import { clientesAxios } from '../config/axios';
import {
  crearHistoriaClinicaSchema,
  GrupoSanguineo,
  Sexo,
  type IHistoriaClinica,
} from '../types/HistoriaClinica.types';
import styles from '../components/recepcionistas/DashboardRecepcion.module.scss';

interface HistoriaClinicaLocationState {
  pacienteNombre?: string;
}

const HistoriaClinica = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const location = useLocation();
  const { pacienteNombre } = (location.state as HistoriaClinicaLocationState | null) ?? {};
  const { data: historias, setData: setHistorias, isLoading } =
    useFetch<IHistoriaClinica[]>('/historiaClinica');
  const [sexo, setSexo] = useState<Sexo | ''>('');
  const [grupoSanguineo, setGrupoSanguineo] = useState<GrupoSanguineo | ''>('');
  const [creando, setCreando] = useState(false);

  const historia = historias?.find((item) => item.pacienteID === pacienteId);

  const crearHistoria = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!pacienteId || !sexo) return;

    const payload = {
      pacienteID: pacienteId,
      datosClinicos: {
        sexo,
        ...(grupoSanguineo ? { grupoSanguineo } : {}),
      },
      antecedentes: {
        alergias: [],
        cirugias: [],
        enfermedadesCronicas: [],
        historiaGeneral: '',
      },
      consultas: [],
    };
    const validacion = crearHistoriaClinicaSchema.safeParse(payload);

    if (!validacion.success) {
      toast.error('Los datos iniciales de la historia clínica no son válidos.');
      return;
    }

    try {
      setCreando(true);
      await clientesAxios.post('/historiaClinica', validacion.data);
      const nuevaHistoria: IHistoriaClinica = validacion.data;
      setHistorias((actuales) => [...(actuales ?? []), nuevaHistoria]);
      toast.success('Historia clínica creada.');
    } catch {
      toast.error('No se pudo crear la historia clínica. Intentá nuevamente.');
    } finally {
      setCreando(false);
    }
  };

  if (!pacienteId) {
    return <Alert variant="danger">No se indicó un paciente para consultar la historia clínica.</Alert>;
  }

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Historia Clínica</h1>
          <p className={styles.subtitulo}>
            {pacienteNombre ? `Paciente: ${pacienteNombre}` : `Paciente: ${pacienteId}`}
          </p>
        </div>
        <Link to="/" className="btn btn-outline-secondary">Volver al dashboard</Link>
      </header>

      {isLoading ? (
        <div className="py-4 text-center" role="status" aria-label="Cargando historia clínica">
          <Spinner animation="border" />
        </div>
      ) : historias === null ? (
        <Alert variant="danger">No se pudo cargar la historia clínica.</Alert>
      ) : historia ? (
        <>
          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Datos clínicos</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>Sexo: {historia.datosClinicos.sexo}</ListGroup.Item>
              <ListGroup.Item>
                Grupo sanguíneo: {historia.datosClinicos.grupoSanguineo ?? 'No registrado'}
              </ListGroup.Item>
            </ListGroup>
          </section>

          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Antecedentes</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Alergias: {historia.antecedentes.alergias.join(', ') || 'Sin registrar'}
              </ListGroup.Item>
              <ListGroup.Item>
                Cirugías: {historia.antecedentes.cirugias.join(', ') || 'Sin registrar'}
              </ListGroup.Item>
              <ListGroup.Item>
                Enfermedades crónicas:{' '}
                {historia.antecedentes.enfermedadesCronicas.join(', ') || 'Sin registrar'}
              </ListGroup.Item>
              <ListGroup.Item>
                Historia general: {historia.antecedentes.historiaGeneral || 'Sin registrar'}
              </ListGroup.Item>
            </ListGroup>
          </section>

          <section className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Consultas</h2>
            {historia.consultas.length === 0 ? (
              <p className="mb-0 text-body-secondary">No hay consultas registradas.</p>
            ) : (
              historia.consultas.map((consulta, index) => (
                <Card key={`${consulta.fecha}-${index}`} className="mb-3">
                  <Card.Body>
                    <Card.Title>
                      {new Date(consulta.fecha).toLocaleDateString('es-AR')}
                    </Card.Title>
                    <Card.Text><strong>Motivo:</strong> {consulta.motivoConsulta}</Card.Text>
                    <Card.Text><strong>Diagnóstico:</strong> {consulta.diagnostico}</Card.Text>
                    <Card.Text><strong>Tratamiento:</strong> {consulta.tratamiento}</Card.Text>
                    <Card.Text><strong>Indicaciones:</strong> {consulta.indicaciones}</Card.Text>
                    {consulta.observaciones && (
                      <Card.Text><strong>Observaciones:</strong> {consulta.observaciones}</Card.Text>
                    )}
                  </Card.Body>
                </Card>
              ))
            )}
          </section>
        </>
      ) : (
        <section className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>Crear historia clínica</h2>
          <p>La historia clínica todavía no existe. Ingresá el dato obligatorio para crearla.</p>
          <Form onSubmit={(event) => void crearHistoria(event)}>
            <Form.Group className="mb-3" controlId="sexoHistoriaClinica">
              <Form.Label>Sexo</Form.Label>
              <Form.Select
                required
                value={sexo}
                onChange={(event) => setSexo(event.target.value as Sexo | '')}
              >
                <option value="">Seleccionar</option>
                <option value={Sexo.FEMENINO}>{Sexo.FEMENINO}</option>
                <option value={Sexo.MASCULINO}>{Sexo.MASCULINO}</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="grupoSanguineoHistoriaClinica">
              <Form.Label>Grupo sanguíneo (opcional)</Form.Label>
              <Form.Select
                value={grupoSanguineo}
                onChange={(event) => setGrupoSanguineo(event.target.value as GrupoSanguineo | '')}
              >
                <option value="">No registrado</option>
                {Object.values(GrupoSanguineo).map((grupo) => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" disabled={!sexo || creando}>
              {creando ? 'Creando...' : 'Crear Historia Clínica'}
            </Button>
          </Form>
        </section>
      )}
    </Container>
  );
};

export default HistoriaClinica;
