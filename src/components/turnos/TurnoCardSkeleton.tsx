import {Col, Card, Placeholder} from 'react-bootstrap';

const TurnosCardSkeleton = () => {
    return(
    <Col md={4}  className="mb-3">
        <Card>
            <Card.Body>
                {/* Nombre del paciente */}
                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                </Placeholder>
                {/* DNI */}
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={4} />
                </Placeholder>
                {/* Fecha del turno */}
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={5} />
                </Placeholder>
                {/* Estado (badge) */}     
                <Placeholder as="h5" animation="glow" className="mt-3">
                    <Placeholder xs={4} bg="warning" />
                </Placeholder>
                {/* Botón */}
                <Placeholder.Button variant="primary" xs={12} className="mt-2" disabled />
            </Card.Body>
        </Card>
    </Col>

    )

}

export default TurnosCardSkeleton;