import { Button, ListGroup } from "react-bootstrap";
import type { IEspecialidad } from "../../../types/Especialidad.type";
import styles from "../EspecialidadListado.module.scss";

interface ListadoEspecialidadProps {
    especialidades: IEspecialidad[];
    cargando: boolean;
    onEditar: (especialidad: IEspecialidad) => void;
    onSolicitarEliminacion: (especialidad: IEspecialidad) => void;
}

const ListadoEspecialidad = ({
    especialidades,
    cargando,
    onEditar,
    onSolicitarEliminacion,
}: ListadoEspecialidadProps) => (
    <ListGroup variant="flush">
        {cargando ? (
            <ListGroup.Item>  Cargando... </ListGroup.Item>
        ) : especialidades.length === 0 ? (
            <ListGroup.Item>No existen especialidades registradas.</ListGroup.Item>
        ) : (especialidades.map((especialidad, index) => (
                <ListGroup.Item
                    key={especialidad.id}
                    className={`d-flex justify-content-between align-items-center ${
                        styles.renglonCompacto
                    } ${
                        index % 2 === 0 ? styles.renglonPar : styles.renglonImpar
                    }`}
                >
                    <div>
                        <strong>{especialidad.nombre}</strong>
                        {especialidad.descripcion && (
                            <div className="text-muted small">
                                {especialidad.descripcion}
                            </div>
                        )}
                    </div>

                    <div className="d-flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEditar(especialidad)}
                        >
                            Editar
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => onSolicitarEliminacion(especialidad)}
                        >
                            Eliminar
                        </Button>
                    </div>
                </ListGroup.Item>
            ))
        )}
    </ListGroup>
);

export default ListadoEspecialidad;
