import { useState, type SubmitEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'sonner';
import { getSession } from '../../auth/session';
import { clientesAxios } from '../../config/axios';
import {
  crearHistoriaClinicaSchema,
  GrupoSanguineo,
  Sexo,
} from '../../types/HistoriaClinica.types';
import styles from '../recepcionistas/DashboardRecepcion.module.scss';

interface CrearHistoriaClinicaProps {
  pacienteId: string;
  onCreated: () => void;
}

const CrearHistoriaClinica = ({
  pacienteId,
  onCreated,
}: CrearHistoriaClinicaProps) => {
  const [sexo, setSexo] = useState<Sexo | ''>('');
  const [grupoSanguineo, setGrupoSanguineo] = useState<GrupoSanguineo | ''>('');
  const [alergias, setAlergias] = useState('');
  const [cirugias, setCirugias] = useState('');
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');
  const [historiaGeneral, setHistoriaGeneral] = useState('');
  const [creando, setCreando] = useState(false);

  const separarAntecedentes = (valor: string): string[] =>
    valor
      .split(/[,\n;]/)
      .map((item) => item.trim())
      .filter(Boolean);

  const crearHistoria = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!sexo) return;

    const session = getSession();
    if (!session?.id) {
      toast.error('No se pudo identificar al médico de la sesión.');
      return;
    }

    const payload = {
      pacienteId,
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

    const validacion = crearHistoriaClinicaSchema.safeParse(payload);
    if (!validacion.success) {
      toast.error('Los datos iniciales de la historia clínica no son válidos.');
      return;
    }

    try {
      setCreando(true);
      await clientesAxios.post('/historiaClinica', validacion.data);
      onCreated();
      toast.success('Historia clínica creada.');
    } catch {
      toast.error('No se pudo crear la historia clínica. Intentá nuevamente.');
    } finally {
      setCreando(false);
    }
  };

  return (
    <section className={styles.seccion}>
      {/*<h3 className={styles.seccionTitulo}>Crear historia clínica</h3>
      <p className="small">Completá los datos de la nueva historia clínica.</p>*/}
      <Form onSubmit={(event) => void crearHistoria(event)}>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="sexoHistoriaClinica">
              <Form.Label className="fw-bold">Sexo</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="sexoFemenino"
                  name="sexoHistoriaClinica"
                  label="Femenino"
                  value={Sexo.FEMENINO}
                  checked={sexo === Sexo.FEMENINO}
                  onChange={() => setSexo(Sexo.FEMENINO)}
                  required
                />
                <Form.Check
                  inline
                  type="radio"
                  id="sexoMasculino"
                  name="sexoHistoriaClinica"
                  label="Masculino"
                  value={Sexo.MASCULINO}
                  checked={sexo === Sexo.MASCULINO}
                  onChange={() => setSexo(Sexo.MASCULINO)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="grupoSanguineoHistoriaClinica">
              <Form.Label className="fw-bold">Grupo sanguíneo (opcional)</Form.Label>
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
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="alergiasHistoriaClinica">
              <Form.Label className="fw-bold">Alergias</Form.Label>
              <Form.Control
                type="text"
                value={alergias}
                onChange={(event) => setAlergias(event.target.value)}
                placeholder="Ej.: Penicilina, mariscos"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="cirugiasHistoriaClinica">
              <Form.Label className="fw-bold">Cirugías</Form.Label>
              <Form.Control
                type="text"
                value={cirugias}
                onChange={(event) => setCirugias(event.target.value)}
                placeholder="Ej.: Apendicectomía, 2020"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="enfermedadesHistoriaClinica">
          <Form.Label className="fw-bold">Enfermedades crónicas</Form.Label>
          <Form.Control
            type="text"
            value={enfermedadesCronicas}
            onChange={(event) => setEnfermedadesCronicas(event.target.value)}
            placeholder="Ej.: Hipertensión, diabetes"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="historiaGeneralHistoriaClinica">
          <Form.Label className="fw-bold">Historia general</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={historiaGeneral}
            onChange={(event) => setHistoriaGeneral(event.target.value)}
            placeholder="Ingresá el antecedente general del paciente"
          />
        </Form.Group>
        <Button type="submit" disabled={!sexo || creando}>
          {creando ? 'Creando...' : 'Crear Historia Clínica'}
        </Button>
      </Form>
    </section>
  );
};

export default CrearHistoriaClinica;
