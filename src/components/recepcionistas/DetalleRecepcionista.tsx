import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { clientesAxios } from '../../config/axios';
import {
  recepcionistaDetalleSchema,
  type IRecepcionistaDetalle,
} from '../../types/Recepcionista.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

const DetalleRecepcionista = () => {
  const { id } = useParams<{ id: string }>();
  const [recepcionista, setRecepcionista] = useState<IRecepcionistaDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelado = false;

    const cargarRecepcionista = async (): Promise<void> => {
      try {
        const { data } = await clientesAxios.get(`/recepcionistas/${id}`);
        const detalle = recepcionistaDetalleSchema.parse(data.datos);

        if (!cancelado) setRecepcionista(detalle);
      } catch (error: unknown) {
        if (!cancelado) setError(obtenerMensajeError(error));
      }
    };

    void cargarRecepcionista();

    return () => {
      cancelado = true;
    };
  }, [id]);

  if (!id) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Identificador de recepcionista no válido.</Alert>
        <Link to="/recepcionistas" className="btn btn-outline-secondary">
          Volver al listado
        </Link>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/recepcionistas" className="btn btn-outline-secondary">
          Volver al listado
        </Link>
      </Container>
    );
  }

  if (!recepcionista) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando recepcionista...</span>
        </Spinner>
      </Container>
    );
  }

  const direccion = [
    `${recepcionista.direccion.calle} ${recepcionista.direccion.numero}`,
    recepcionista.direccion.piso && `Piso ${recepcionista.direccion.piso}`,
    recepcionista.direccion.departamento && `Departamento ${recepcionista.direccion.departamento}`,
  ].filter(Boolean).join(' · ');
  const telefono =
    `+${recepcionista.telefono.codigoPais} (${recepcionista.telefono.codigoArea}) ${recepcionista.telefono.numero}`;

  return (
    <Container className="pb-5">
      <p className="text-body-secondary mb-1">Detalle del Recepcionista</p>
      <h1 className="h2 mb-4">{recepcionista.nombre}</h1>
 {/*
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <div className="small text-body-secondary">DNI</div>
              <div className="fw-semibold">{recepcionista.dni}</div>
            </Col>
            <Col xs={12} md={4}>
              <div className="small text-body-secondary">Teléfono</div>
              <div className="fw-semibold">{telefono}</div>
            </Col>
            
            <Col xs={12} md={4}>
              <div className="small text-body-secondary">Identificador</div>
              <div className="fw-semibold text-break">{recepcionista.id}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
*/}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-semibold">Datos personales</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <span className="text-body-secondary">DNI</span>
            <br />
            {recepcionista.dni}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="text-body-secondary">Teléfono</span>
            <br />
            {telefono}
          </ListGroup.Item>

          <ListGroup.Item>
            <span className="text-body-secondary">Email</span>
            <br />
            {recepcionista.email}
            
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="text-body-secondary">Dirección</span>
            <br />
            {direccion || 'No registrada'}
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <Link to="/recepcionistas" className="btn btn-outline-secondary mt-4">
        Volver al listado
      </Link>
    </Container>
  );
};

export default DetalleRecepcionista;
