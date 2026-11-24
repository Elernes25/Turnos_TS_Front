import {Row, Col, Form } from 'react-bootstrap';


const BuscadorMedicos = ({valor, alCambiar}:BuscadorMedicosProps) =>{

    const handleChange = (evento:React.ChangeEvent<HTMLInputElement>) => { /*para el tipado de evento */
        alCambiar(evento.target.value); 
    }

    return (
    <Row className="mb-4">
        <Col md={6}>
            <Form.Control
                type="search"
                aria-label="Buscar médico por nombre o especialidad"
                placeholder="Buscar por nombre o especialidad..."
                value={valor}
                onChange={handleChange}
            />
        </Col>    
    </Row>
    )
}

interface BuscadorMedicosProps {
    valor:string;
    alCambiar: (nuevoValor:string)=> void;
}

export default BuscadorMedicos;