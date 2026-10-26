//import { useState } from "react";
import { useFetch } from '../../hooks/useFetch';
import { Button, ListGroup, Container} from "react-bootstrap";
import styles from './listado.module.scss'
import ListadoSkeleton from "./ListadoSkeleton";
import type { IMedico } from "../../types/Medico.type";

const ListadoMedicos = () => {
    
    //const { response: response, data: medicos, isLoading } = useFetch<IMedico[]>('/medicos'); /*DEBE COINCIDIR CON LA RUTA DEL BACKEND */
    const { data: medicos, isLoading } = useFetch<IMedico[]>('/medicos'); /*DEBE COINCIDIR CON LA RUTA DEL BACKEND */
    console.log("Medicos:", medicos);
    //console.log("Response en medicos:", response);
       
    return (
        <Container>
           
             <ListGroup>
                {isLoading ? ([1, 2, 3].map(item => <ListadoSkeleton key={item} />)) : !medicos || medicos.length === 0 ? 
                    (
                    <p>No se encontraron Médicos</p>
                    ) : 
                    medicos.map((each, index) => (
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
                        {each.nombre}
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                            variant="secondary"
                            size="sm"
                            className={styles.botonChico}
                            
                        // onClick={() => handleEditar(each)}
                            >
                            Ver Detalles
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

export default ListadoMedicos;