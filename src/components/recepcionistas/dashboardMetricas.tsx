import { Card, Col, Row } from "react-bootstrap";

interface Props {
    turnos: any[];
    medicos: any[];
}

const DashboardMetricas = ({
    turnos,
    medicos,
    
}: Props) => {
    const atendidos = turnos.filter(
        (t) => t.estado === "atendido"
    ).length;

    const pendientes = turnos.filter(
        (t) => t.estado === "pendiente"
    ).length;

    return (
        <Row className="mb-4">

            <Col md={3}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Turnos
                        </Card.Title>
                        <h3>{turnos.length}</h3>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={3}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Pendientes
                        </Card.Title>
                        <h3>{pendientes}</h3>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={3}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Atendidos
                        </Card.Title>
                        <h3>{atendidos}</h3>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={3}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Médicos Hoy
                        </Card.Title>
                        <h3>{medicos.length}</h3>
                    </Card.Body>
                </Card>
            </Col>

        </Row>
    );
};

export default DashboardMetricas;