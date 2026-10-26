import { useState } from "react";
import { useFetch } from '/src/hooks/useFetch';
import { Button, ListGroup, Container} from "react-bootstrap";
import styles from './listado.module.scss'
import ListadoSkeleton from "./ListadoSkeleton";
import ModalEspecialidad from './FormularioCrearEdicion';


const ListadoEspecialidades = () => {
    
    const { response: response, data: especialidades, isLoading } = useFetch('/especialidad'); /*DEBE COINCIDIR CON LA RUTA DEL BACKEND */
    console.log("Especialidades:", especialidades);
    console.log("Response en especialidades:", response);

    /******************************** */
                const [showModal, setShowModal] = useState(false);
                const [editData, setEditData] = useState(null);

                const handleCrear = () => {
                setEditData(null);
                setShowModal(true);
                };

                const handleEditar = (especialidad) => {
                setEditData(especialidad);
                setShowModal(true);
                }; 
            
/******************************************** */


       
    return (
        <Container>
             <ModalEspecialidad
                show={showModal}
                onHide={() => setShowModal(false)}
                datos={editData}
            />
            <Button
                variant="primary"
                onClick={handleCrear}>
             + Crear Especialidad
            </Button>
           
             <ListGroup>
                {isLoading ? (
                    [1, 2, 3].map(item => <ListadoSkeleton key={item} />) 
                 ) : especialidades.length === 0 ? (
                    <p>No se encontraron Especialidades</p>
                ) : 

                especialidades.map((each, index) => (
                    <ListGroup.Item
                    key={index}
                    className={styles.renglonCompacto}
                    style={{
                        backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    >
                    {each.especialidadNombre}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                        variant="secondary"
                        size="sm"
                        className={styles.botonChico}
                        
                        onClick={() => handleEditar(each)}
                        >
                        Editar
                        </Button>
                        <Button
                        variant="danger"
                        size="sm"
                        className={styles.botonChico}
                        
                        >
                        Eliminar
                        </Button>
                    </div>
                    </ListGroup.Item>
                ))}
                
                </ListGroup>

        </Container>
       
    );
};

export default ListadoEspecialidades;


