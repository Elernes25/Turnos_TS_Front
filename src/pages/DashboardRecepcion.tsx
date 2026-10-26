import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Container, Row } from "react-bootstrap";
import { toast } from 'sonner';
import {clientesAxios} from "../config/axios";


import BuscadorTurnos from "../components/turnos/BuscadorTurnos";
import TurnoCard from "../components/turnos/TurnoCard";
import TurnoCardSkeleton from "../components/turnos/TurnoCardSkeleton";
import { ITurno } from "../types/Turno.type";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState<string>("");
    const { response: response, data: turnos, setData: setTurnos, isLoading } = useFetch<ITurno[]>('/turnos');

    console.log("Turnos en DashboardRecepcion:", turnos);
    console.log("Response en DashboardRecepcion:", response);
    
    const turnosFiltrados = (turnos || []).filter(turno =>
        (turno.paciente?.nombre ?? "paciente sin asignar").toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    );

    const marcarComoAtendido = async (idTurno:string) => {
        try {
            await clientesAxios.patch(`/turnos/${idTurno}`);

            const turnosActualizados = turnos?.map(turno => {  // signo de pregunta porque puede ser nulo
                if (turno.id === idTurno) return { ...turno, estado: "atendido" as const};
                return turno;
            });
            setTurnos(turnosActualizados || []);

        } catch (error) {
            console.error(error);
            toast.error("Error de red.");
        }
    };

    return (
        <Container className="mt-4">
           {/** <h2 className="mb-4">Turnos del Día total: {response.total} </h2>  ese total venia del respuesta estandar**/}
            <h2 className="mb-4">Turnos del Día total: {turnos?.length || 0} </h2>
            <BuscadorTurnos valor={busqueda} alCambiar={setBusqueda} />
 
            <Row>
                {isLoading ? (
                    [1, 2, 3].map(item => <TurnoCardSkeleton key={item} />) 
                 ) : turnos?.length === 0 ? (
                    <p>No se encontraron turnos pendientes.</p>
                ) : 
                turnosFiltrados.map((turno) => (
                    <TurnoCard
                        key={turno.id}
                        turno={turno}
                        onAtender={marcarComoAtendido}
                    />
                ))}
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;