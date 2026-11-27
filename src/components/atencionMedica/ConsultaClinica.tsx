import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getSession } from '../../auth/session';
import { clientesAxios } from '../../config/axios';
import { calcularEdad } from '../../utils/calcularEdad';
import { consultaClinicaFormSchema, consultaClinicaSchema, type IConsultaClinicaFormData, type IConsultaClinicaFormOutput,} from '../../types/ConsultaClinica.types';
import styles from '../recepcionistas/DashboardRecepcion.module.scss';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import ModalFinConsulta from './components/ModalFinConsulta';

interface ConsultaClinicaLocationState {
  pacienteNombre?: string;
  pacienteFechaNacimiento?: string;
  turnoId?: string;
}

const ConsultaClinica = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { pacienteNombre, pacienteFechaNacimiento, turnoId } =
    (location.state as ConsultaClinicaLocationState | null) ?? {};
  const edadPaciente = calcularEdad(pacienteFechaNacimiento);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [consultaCreada, setConsultaCreada] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IConsultaClinicaFormData, unknown, IConsultaClinicaFormOutput>({
    resolver: zodResolver(consultaClinicaFormSchema),
    defaultValues: {
      motivoConsulta: '',
      diagnostico: '',
      tratamiento: '',
      indicaciones: '',
      observaciones: '',
    },
  });

  const marcarTurnoAtendido = async (): Promise<void> => {
    if (!turnoId) {
      toast.error('No se pudo identificar el turno del paciente.');
      return;
    }

    await clientesAxios.patch(`/turnos/${turnoId}`);
    toast.success('Consulta guardada y turno marcado como atendido.');
    setMostrarModal(false);
    navigate('/medico');
  };

  const crearConsulta = async (datos: IConsultaClinicaFormData): Promise<void> => {
    if (!pacienteId) return;

    const session = getSession();
    if (!session?.id) {
      toast.error('No se pudo identificar al médico de la sesión.');
      return;
    }

    const validacion = consultaClinicaSchema.safeParse({
      pacienteId,
      medicoId: session.id,
      ...datos,
    });
    if (!validacion.success) {
      toast.error(validacion.error.issues[0]?.message ?? 'Los datos de la consulta no son válidos.');
      return;
    }

    if (!turnoId) {
      toast.error('No se pudo identificar el turno del paciente.');
      return;
    }

    try {
      setGuardando(true);
      if (!consultaCreada) {
        await clientesAxios.post('/consultaClinica', validacion.data);
        setConsultaCreada(true);
      }
      await marcarTurnoAtendido();
    } catch (error: unknown) {
      toast.error(obtenerMensajeError(error));
    } finally {
      setGuardando(false);
    }
  };

  const confirmarGuardar = async (): Promise<void> => {
    if (!consultaCreada) {
      await handleSubmit(crearConsulta)();
      return;
    }

    try {
      setGuardando(true);
      await marcarTurnoAtendido();
    } catch (error: unknown) {
      toast.error(obtenerMensajeError(error));
    } finally {
      setGuardando(false);
    }
  };

  if (!pacienteId) {
    return <Alert variant="danger">No se indicó un paciente para la consulta.</Alert>;
  }

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Consulta Nueva</h1>
          <p className={styles.subtitulo}>
            {pacienteNombre ? `Paciente: ${pacienteNombre}` : `Paciente: ${pacienteId}`}
            {edadPaciente !== null && ` - Edad: ${edadPaciente} ${edadPaciente === 1 ? 'año' : 'años'}`}
            {` - Fecha: ${new Date().toLocaleDateString("es-AR")}`}
          </p>
        </div>
        <Link
          to={`/historia-clinica/${pacienteId}`}
          state={{ pacienteNombre, pacienteFechaNacimiento, turnoId }}
          className="btn btn-outline-secondary"
        >
          Volver a la historia clínica
        </Link>
      </header>

      <section className={styles.seccion}>
        <Form onSubmit={handleSubmit(() => setMostrarModal(true))}>
          <fieldset disabled={consultaCreada}>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group controlId="motivoConsulta">
                <Form.Label className="fw-bold">Motivo de la consulta</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  isInvalid={Boolean(errors.motivoConsulta)}
                  {...register('motivoConsulta')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.motivoConsulta?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="diagnosticoConsulta">
                <Form.Label className="fw-bold">Diagnóstico</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  isInvalid={Boolean(errors.diagnostico)}
                  {...register('diagnostico')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.diagnostico?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="tratamientoConsulta">
                <Form.Label className="fw-bold">Tratamiento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  isInvalid={Boolean(errors.tratamiento)}
                  {...register('tratamiento')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tratamiento?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="indicacionesConsulta">
                <Form.Label className="fw-bold">Indicaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  isInvalid={Boolean(errors.indicaciones)}
                  {...register('indicaciones')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.indicaciones?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="observacionesConsulta">
                <Form.Label className="fw-bold">Observaciones (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  isInvalid={Boolean(errors.observaciones)}
                  {...register('observaciones')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.observaciones?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          </fieldset>
          <Button type="submit" className="mt-3" disabled={isSubmitting || guardando}>
            {isSubmitting ? 'Guardando...' : 'Guardar consulta'}
          </Button>
        </Form>
      </section>
      <ModalFinConsulta
        mostrar={mostrarModal}
        guardando={guardando}
        puedeGuardar={Boolean(turnoId)}
        onVolver={() => setMostrarModal(false)}
        onGuardar={() => void confirmarGuardar()}
      />
    </Container>
  );
};

export default ConsultaClinica;
