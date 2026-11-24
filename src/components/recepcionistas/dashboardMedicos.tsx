import { Card, ListGroup, Spinner } from "react-bootstrap";

import { IMedico } from "../../types/Medico.type";
import { IEspecialidad } from "../../types/Especialidad.type";

interface Props {
    especialidades: IEspecialidad[];
    medicos: IMedico[];
    isLoading: boolean;
}

const DashboardMedicos = ({ especialidades, medicos, isLoading}: Props) => {
    return (
        <Card className="mb-3">
            <Card.Header>  Médicos por Especialidad </Card.Header>
            <Card.Body>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <ListGroup variant="flush">
                        {(especialidades??[]).map((especialidad) => {
                            console.log(medicos)
                            const medicosEspecialidad = medicos.filter((medico) => medico.especialidad.some(
                                    (esp) => esp.id === especialidad.id )
                            );

                            return (
                                <ListGroup.Item key={especialidad.id} >
                                    <strong>
                                        {especialidad.nombre}
                                    </strong>
                                    <div className="mt-2">
                                        {medicosEspecialidad.length >
                                        0 ? (medicosEspecialidad.map(( medico) => (
                                                    <div key={ medico.id } >
                                                        { medico.nombre }
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <small className="text-muted"> Sin médicos asignados </small>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default DashboardMedicos;