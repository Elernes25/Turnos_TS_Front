import { useEffect, useState, type SubmitEvent } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getSession } from '../../auth/session';
import { clientesAxios } from '../../config/axios';
import {
  GrupoSanguineo,
  Sexo,
  type IHistoriaClinica,
} from '../../types/HistoriaClinica.types';
import styles from '../recepcionistas/DashboardRecepcion.module.scss';

const separarAntecedentes = (valor: string): string[] =>
  valor
    .split(/[,\n;]/)
    .map((item) => item.trim())
    .filter(Boolean);

interface EditarHistoriaLocationState {
  historia?: IHistoriaClinica;
}

const EditarHistoriaClinica = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { historia: historiaDeNavegacion } =
    (location.state as EditarHistoriaLocationState | null) ?? {};
  const [historia, setHistoria] = useState<IHistoriaClinica | null>(null);
  const [sexo, setSexo] = useState<Sexo | ''>('');
  const [grupoSanguineo, setGrupoSanguineo] = useState<GrupoSanguineo | ''>('');
  const [alergias, setAlergias] = useState('');
  const [cirugias, setCirugias] = useState('');
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');
  const [historiaGeneral, setHistoriaGeneral] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelado = false;

    const aplicarHistoria = (historiaCargada: IHistoriaClinica): void => {
      setHistoria(historiaCargada);
      setSexo(historiaCargada.datosClinicos.sexo);
      setGrupoSanguineo(historiaCargada.datosClinicos.grupoSanguineo ?? '');
      setAlergias(historiaCargada.antecedentes.alergias.join(', '));
      setCirugias(historiaCargada.antecedentes.cirugias.join(', '));
      setEnfermedadesCronicas(
        historiaCargada.antecedentes.enfermedadesCronicas.join(', '),
      );
      setHistoriaGeneral(historiaCargada.antecedentes.historiaGeneral);
    };

    if (historiaDeNavegacion) {
      aplicarHistoria(historiaDeNavegacion);
      setCargando(false);
      return () => {
        cancelado = true;
      };
    }

    const cargarHistoria = async (): Promise<void> => {
      try {
        setCargando(true);
        const { data } = await clientesAxios.get<
          IHistoriaClinica | IHistoriaClinica[] | {
            datos: IHistoriaClinica | IHistoriaClinica[];
          }
        >(`/historiaClinica/${id}`);
        const datosRespuesta = 'datos' in data ? data.datos : data;
        const historiaCargada = Array.isArray(datosRespuesta)
          ? datosRespuesta[0]
          : datosRespuesta;
        if (cancelado) return;

        if (historiaCargada) aplicarHistoria(historiaCargada);
      } catch {
        if (!cancelado) toast.error('No se pudo cargar la historia clínica.');
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargarHistoria();
    return () => {
      cancelado = true;
    };
  }, [id, historiaDeNavegacion]);

  const guardarHistoria = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!id || !sexo || !historia) return;

    const session = getSession();
    if (!session?.id) {
      toast.error('No se pudo identificar al médico de la sesión.');
      return;
    }

    const payload = {
      pacienteId: historia.pacienteId,
      datosClinicos: {
        sexo,
        ...(grupoSanguineo ? { grupoSanguineo } : {}),
      },
      antecedentes: {
        alergias: separarAntecedentes(alergias),
        cirugias: separarAntecedentes(cirugias),
        enfermedadesCronicas: separarAntecedentes(enfermedadesCronicas),
        historiaGeneral: historiaGeneral.trim(),
      },
      modificacion: {
        medicoId: session.id,
        fecha: new Date().toISOString(),
      },
    };

    try {
      setGuardando(true);
      await clientesAxios.put(`/historiaClinica/${id}`, payload);
      toast.success('Historia clínica actualizada.');
      navigate(`/historia-clinica/${historia.pacienteId}`);
    } catch {
      toast.error('No se pudo actualizar la historia clínica.');
    } finally {
      setGuardando(false);
    }
  };

  if (!id) {
    return <Alert variant="danger">No se indicó el identificador de la historia clínica.</Alert>;
  }

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={`${styles.encabezado} ${styles.encabezadoHistoria}`}>
        <h1 className={styles.titulo}> Editar Historia Clínica </h1>
        {historia?.pacienteId && (
          <Link
            to={`/historia-clinica/${historia.pacienteId}`}
            className="btn btn-outline-secondary"
          >
            Volver
          </Link>
        )}
      </header>

      {cargando ? (
        <div className="py-4 text-center">
          <Spinner animation="border" />
        </div>
      ) : !historia ? (
        <Alert variant="danger">No se encontró la historia clínica.</Alert>
      ) : (
        <section className={styles.seccion}>
          <Form onSubmit={(event) => void guardarHistoria(event)}>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="editarSexoHistoriaClinica">
                  <Form.Label className="fw-bold">Sexo</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      id="editarSexoFemenino"
                      name="editarSexoHistoriaClinica"
                      label="Femenino"
                      checked={sexo === Sexo.FEMENINO}
                      onChange={() => setSexo(Sexo.FEMENINO)}
                      required
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="editarSexoMasculino"
                      name="editarSexoHistoriaClinica"
                      label="Masculino"
                      checked={sexo === Sexo.MASCULINO}
                      onChange={() => setSexo(Sexo.MASCULINO)}
                      required
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="editarGrupoSanguineoHistoriaClinica">
                  <Form.Label className="fw-bold">Grupo sanguíneo (opcional)</Form.Label>
                  <Form.Select
                    value={grupoSanguineo}
                    onChange={(event) =>
                      setGrupoSanguineo(event.target.value as GrupoSanguineo | '')
                    }
                  >
                    <option value="">No registrado</option>
                    {Object.values(GrupoSanguineo).map((grupo) => (
                      <option key={grupo} value={grupo}>{grupo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="editarAlergiasHistoriaClinica">
                  <Form.Label className="fw-bold">Alergias</Form.Label>
                  <Form.Control
                    type="text"
                    value={alergias}
                    onChange={(event) => setAlergias(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="editarCirugiasHistoriaClinica">
                  <Form.Label className="fw-bold">Cirugías</Form.Label>
                  <Form.Control
                    type="text"
                    value={cirugias}
                    onChange={(event) => setCirugias(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="editarEnfermedadesHistoriaClinica">
              <Form.Label className="fw-bold">Enfermedades crónicas</Form.Label>
              <Form.Control
                type="text"
                value={enfermedadesCronicas}
                onChange={(event) => setEnfermedadesCronicas(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editarHistoriaGeneralHistoriaClinica">
              <Form.Label className="fw-bold">Historia general</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={historiaGeneral}
                onChange={(event) => setHistoriaGeneral(event.target.value)}
              />
            </Form.Group>
            <Button type="submit" disabled={!sexo || guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </Form>
        </section>
      )}
    </Container>
  );
};

export default EditarHistoriaClinica;
