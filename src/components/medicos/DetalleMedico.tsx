import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Card, Col, Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import { clientesAxios } from '../../config/axios';
import { medicoDetalleSchema, type ImedicoDetalleSchema } from '../../types/Medico.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

const DetalleMedico = () => {
  const { id } = useParams<{ id: string }>();
  const [medico, setMedico] = useState<ImedicoDetalleSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelado = false;

    const cargarMedico = async (): Promise<void> => {
      try {
        const { data } = await clientesAxios.get(`/medicos/${id}`);
        const detalle = medicoDetalleSchema.parse(data.datos);

        if (!cancelado) {
          setMedico(detalle);
        }
      } catch (error: unknown) {
        if (!cancelado) {
          setError(obtenerMensajeError(error));
        }
      }
    };

    void cargarMedico();

    return () => {
      cancelado = true;
    };
  }, [id]);

  if (!id) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Identificador de médico no válido.</Alert>
        <Link to="/listado-medicos" className="btn btn-outline-secondary">
          Volver al listado
        </Link>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/listado-medicos" className="btn btn-outline-secondary">
          Volver al listado
        </Link>
      </Container>
    );
  }

  if (!medico) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando médico...</span>
        </Spinner>
      </Container>
    );
  }

  const direccion = [
    `${medico.direccion.calle} ${medico.direccion.numero}`,
    medico.direccion.piso && `Piso ${medico.direccion.piso}`,
    medico.direccion.departamento && `Departamento ${medico.direccion.departamento}`,
    medico.direccion.barrio && `Barrio ${medico.direccion.barrio}`,
  ].filter(Boolean).join(' · ');
  const telefono = `+${medico.telefono.codigoPais} (${medico.telefono.codigoArea}) ${medico.telefono.numero}`;

  return (
    <Container className="pb-5">
      <p className="text-body-secondary mb-1">Detalle del médico</p>
      <h1 className="h2 mb-4">{medico.nombre}</h1>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <div className="small text-body-secondary">Especialidades</div>
              <div className="fw-semibold">
                {medico.especialidad.map((especialidad) => especialidad.nombre).join(', ') || 'Sin especialidades'}
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="small text-body-secondary">Matrícula</div>
              <div className="fw-semibold">MP {medico.numeroMatricula}</div>
            </Col>
            <Col xs={12} md={4}>
              <div className="small text-body-secondary">Identificador</div>
              <div className="fw-semibold text-break">{medico.id}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-semibold">Datos personales</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <span className="text-body-secondary">DNI</span>
            <br />
            {medico.dni}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="text-body-secondary">Email</span>
            <br />
            {medico.email || 'No registrado'}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="text-body-secondary">Teléfono</span>
            <br />
            {telefono}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="text-body-secondary">Dirección</span>
            <br />
            {direccion || 'No registrada'}
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <Link to="/listado-medicos" className="btn btn-outline-secondary mt-4">
        Volver al listado
      </Link>
    </Container>
  );
};

export default DetalleMedico;
