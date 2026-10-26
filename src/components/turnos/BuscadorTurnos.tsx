import {Row, Col, Form } from 'react-bootstrap';


const BuscadorTurnos = ({valor, alCambiar}:BuscadorTurnosProps) =>{

    const handleChange = (evento:React.ChangeEvent<HTMLInputElement>) => { /*para el tipado de evento */
        alCambiar(evento.target.value); 
    }

    return (
    <Row className="mb-4">
        <Col md={6}>
            <Form.Control
                type="text"
                placeholder="Buscar Paciente..."
                value={valor}
                 /*antes estaba  onChange=(evento)=>alCambiar(evento.target.value)*/
                 /*al usar bootstrap no hace falta cambiarlo porque ya esta tipado*/
                onChange={handleChange}
            />
        </Col>    
    </Row>
    )
}

interface BuscadorTurnosProps {
    valor:string;
    alCambiar: (nuevoValor:string)=> void;
}

export default BuscadorTurnos;