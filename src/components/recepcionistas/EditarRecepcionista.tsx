import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { clientesAxios } from '../../config/axios';
import {
    recepcionistaDetalleSchema,
    type ICrearRecepcionistaDTO,
} from '../../types/Recepcionista.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import FormularioRecepcionista from './FormularioRecepcionista';

const EditarRecepcionista = () => {
    const { id } = useParams<{ id: string }>();
    const [recepcionista, setRecepcionista] = useState<ICrearRecepcionistaDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let cancelado = false;

        const cargarRecepcionista = async (): Promise<void> => {
            try {
                const { data } = await clientesAxios.get(`/recepcionistas/${id}`);
                const detalle = recepcionistaDetalleSchema.parse(data.datos);
                const valoresFormulario: ICrearRecepcionistaDTO = {
                    nombre: detalle.nombre,
                    dni: detalle.dni,
                    email: detalle.email,
                    direccion: detalle.direccion,
                    telefono: detalle.telefono,
                };

                if (!cancelado) setRecepcionista(valoresFormulario);
            } catch (error: unknown) {
                if (!cancelado) setError(obtenerMensajeError(error));
            }
        };

        void cargarRecepcionista();

        return () => {
            cancelado = true;
        };
    }, [id]);

    if (!id) {
        return <Alert variant="danger">Identificador de recepcionista no válido.</Alert>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!recepcionista) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando recepcionista...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <FormularioRecepcionista
            key={id}
            recepcionistaId={id}
            valoresIniciales={recepcionista}
        />
    );
};

export default EditarRecepcionista;
