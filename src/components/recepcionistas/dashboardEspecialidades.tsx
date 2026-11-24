import { Card,ListGroup,Spinner} from "react-bootstrap";
import { IEspecialidad } from "../../types/Especialidad.type";

interface Props {
    especialidades: IEspecialidad[];
    isLoading: boolean;
}

const DashboardEspecialidades = ({ especialidades, isLoading}: Props) => {
    return (
        <Card className="mb-3">
            <Card.Header> Especialidades </Card.Header>
            <Card.Body>
                {isLoading ? (<Spinner /> ) : (
                    <ListGroup variant="flush">
                        {especialidades.map(
                            (especialidad) => (
                                <ListGroup.Item key={especialidad.id} >
                                    <strong>{especialidad.nombre}</strong>
                                    {especialidad.descripcion && (
                                        <div>
                                            <small>
                                                { especialidad.descripcion }
                                            </small>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )
                        )}
                    </ListGroup>)
                }
            </Card.Body>
        </Card>
    );
};

export default DashboardEspecialidades;