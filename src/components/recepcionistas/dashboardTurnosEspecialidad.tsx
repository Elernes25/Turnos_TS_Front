
import { Card,ListGroup} from "react-bootstrap";
import { ITurno } from "../../types/Turno.type";

interface Props {
    turnos: ITurno[];
}

const DashboardTurnosEspecialidad = ({turnos}: Props) => {
  
  /* const resumen = (turnos ?? []).reduce(
    (acc, turno) => {
        acc[turno.especialidad] = (acc[turno.especialidad] || 0) + 1;
        console.log("turno especialidad----->",turno.especialidad);
        return acc;
    },  {} as Record<string, number>
    );
    */
    const resumen = (turnos ?? []).reduce(
    (acc, turno) => {
        const nombreEspecialidad = turno.especialidad?.nombre ?? "Sin especialidad";
        acc[nombreEspecialidad] =
            (acc[nombreEspecialidad] || 0) + 1;

        return acc;
    },
    {} as Record<string, number>
);

    return (
        <Card>
            <Card.Header> Turnos por Especialidad </Card.Header>
            <ListGroup variant="flush">
                {Object.entries(resumen).map(
                    ([especialidad, cantidad]) => (
                        <ListGroup.Item key={especialidad} >
                            <strong> {especialidad} </strong> {" : "} {cantidad}
                        </ListGroup.Item>
                    )
                )}
            </ListGroup>
        </Card>
    );
};

export default DashboardTurnosEspecialidad;