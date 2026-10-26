import {Col,Card,Badge,Button} from 'react-bootstrap';
import { ITurno } from '../../types/Turno.type';
import { Link } from 'react-router-dom';

/*
mostrar nombre paciente con boton con recuadro atendido o en espera
DNI
Especialidad - Nombre del medico
Fecha y hora del turno
consultorio nro
boton detalle del turno
boton llamar
*/


const TurnoCard =({turno, onAtender}:TurnoCardProps) =>{
    const paciente =turno.paciente;
    const fechaTurno =new Date (turno.fechaTurno);

    //const dni : Ipaciente.dni;
    const estaAtendido = String(turno.estado).toLowerCase() === 'atendido';
    return(

        <Col md={4} key={turno.id} className="mb-3">
                <Card>
                    <Card.Body>
                        <Card.Title>{paciente.nombre}</Card.Title>
                        <h6>{paciente.dni}</h6>
                        <h6>
                            {new Intl.DateTimeFormat("es-AR", {
                                dateStyle: "long",
                                timeStyle: "short"
                            }).format(new Date(fechaTurno))}
                        </h6>

                    <h5 className="mt-3">
                        {estaAtendido
                            ? <Badge bg="success">Atendido</Badge> 
                            : <Badge bg="warning" text="dark"> En Espera</Badge>
                        }
                    </h5>
                    
                    <Link to={`/turno-detalle/${turno.id}`} className="btn btn-outline-secondary flex-grow-1">
                            Ver detalle
                    </Link>

                    <Button onClick={() => onAtender(turno.id)} 
                            disabled={estaAtendido}>
                            Llamar
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    )

}

 interface TurnoCardProps{
        turno:ITurno;
        onAtender: (idTurno : string)=> void;  // no devuelve resultado
 }
 
export default TurnoCard;