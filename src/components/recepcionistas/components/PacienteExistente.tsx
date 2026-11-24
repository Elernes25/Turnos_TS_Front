import { Button, Card, Col, Row } from 'react-bootstrap';
import type { IPaciente } from '../../../types/Paciente.type';

interface PacienteExistenteProps {
    paciente: IPaciente;
    onCambiarPaciente: () => void;
    onCargarTurno: () => void;
}

const PacienteExistente = ({
    paciente,
    onCambiarPaciente,
    onCargarTurno,
}: PacienteExistenteProps) => {
    const obraSocial = paciente.obraSocial;
    const nombreObraSocial = 'nombre' in obraSocial && typeof obraSocial.nombre === 'string'
        ? obraSocial.nombre
        : 'nombreObraSocial' in obraSocial && typeof obraSocial.nombreObraSocial === 'string'
            ? obraSocial.nombreObraSocial
            : 'Ninguna';
    const direccion = [
        paciente.direccion.calle,
        paciente.direccion.numero,
        paciente.direccion.piso ? `Piso ${paciente.direccion.piso}` : '',
        paciente.direccion.departamento ? `Depto. ${paciente.direccion.departamento}` : '',
    ].filter(Boolean).join(' ');
    const telefono = [
        paciente.telefono.codigoPais,
        paciente.telefono.codigoArea,
        paciente.telefono.numero,
    ].filter(Boolean).join(' ');

    return (
        <Card className="mt-4">
            <Card.Header>Paciente existente</Card.Header>
            <Card.Body>
                <Row className="g-3">
                    <Col md={6}>
                        <strong>Nombre:</strong> {paciente.nombre}
                    </Col>
                    <Col md={6}>
                        <strong>DNI:</strong> {paciente.dni}
                    </Col>
                    <Col md={6}>
                        <strong>Fecha de nacimiento:</strong> {paciente.fechaDeNacimiento.slice(0, 10)}
                    </Col>
                    <Col md={6}>
                        <strong>Email:</strong> {paciente.email || 'No informado'}
                    </Col>
                    <Col md={6}>
                        <strong>Dirección:</strong> {direccion || 'No informada'}
                    </Col>
                    <Col md={6}>
                        <strong>Teléfono:</strong> {telefono || 'No informado'}
                    </Col>
                    <Col md={6}>
                        <strong>Obra social:</strong> {nombreObraSocial}
                    </Col>
                    <Col md={6}>
                        <strong>Número de afiliado:</strong> {obraSocial.numeroAfiliado || 'No informado'}
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button type="button" variant="outline-secondary" onClick={onCambiarPaciente}>
                        Cambiar paciente
                    </Button>
                    <Button type="button" onClick={onCargarTurno}>
                        Cargar Turno
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PacienteExistente;
