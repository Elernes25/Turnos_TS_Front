import { Card, Col, Row } from "react-bootstrap";
import type { ITurno } from "../../types/Turno.type";

interface Props {
    turnos: ITurno[];
}

interface GrupoMetricasProps {
    titulo: string;
    turnos: ITurno[];
}

const GrupoMetricas = ({ titulo, turnos }: GrupoMetricasProps) => {
    const metricas = [
        {
            titulo: "Atendidos",
            cantidad: turnos.filter((turno) => turno.estado === "atendido").length,
        },
        {
            titulo: "Pendientes",
            cantidad: turnos.filter((turno) => turno.estado === "pendiente").length,
        },
        {
            titulo: "Cancelados",
            cantidad: turnos.filter((turno) => turno.estado === "cancelado").length,
        },
    ];

    return (
        <Card className="h-100">
            {/* Reduce el padding de la Card principal con p-2 o p-3 */}
            <Card.Body className="p-2 px-3">
            {/* Achica el título a h5/h6 y reduce su margen inferior */}
            <h5 className="mb-2 fs-6 fw-bold">
                {titulo} <span className="text-body-secondary">{turnos.length}</span>
            </h5>

            {/* g-3 por g-2 para acercar las 3 cards entre sí */}
            <Row className="g-2">
                {metricas.map((metrica) => (
                <Col key={metrica.titulo} xs={12} sm={4}>
                    <Card className="h-100 text-center">
                    {/* py-1 px-2 para quitar el padding vertical por defecto */}
                    <Card.Body className="py-1 px-2">
                        {/* small o una clase custom en .module.scss para el título */}
                        <Card.Title className="mb-0 small text-muted text-nowrap">
                        {metrica.titulo}
                        </Card.Title>
                        {/* fs-4 a fs-5 y el interlineado con lh-sm */}
                        <p className="mb-0 fs-5 fw-bold lh-sm">{metrica.cantidad}</p>
                    </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>
            </Card.Body>
        </Card>
    );
};

const DashboardMetricas = ({ turnos }: Props) => {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);
    const hoy = inicioHoy.getTime();

    const turnosDeHoy = turnos.filter((turno) => {
        const fechaTurno = new Date(turno.fechaTurno);
        if (Number.isNaN(fechaTurno.getTime())) return false;

        fechaTurno.setHours(0, 0, 0, 0);
        return fechaTurno.getTime() === hoy;
    });

    return <GrupoMetricas titulo="Turnos Hoy: " turnos={turnosDeHoy} />;
};

export default DashboardMetricas;
