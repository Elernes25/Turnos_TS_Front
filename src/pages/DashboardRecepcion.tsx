/*import { useState } from "react";
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
           {// <h2 className="mb-4">Turnos del Día total: {response.total} </h2>  ese total venia del respuesta estandar//}
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
*/
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useFetch } from "../hooks/useFetch";

import BuscadorTurnos from "../components/turnos/BuscadorTurnos";
import TurnoCard from "../components/turnos/TurnoCard";
import TurnoCardSkeleton from "../components/turnos/TurnoCardSkeleton";

import DashboardMetricas from "../components/recepcionistas/dashboardMetricas";
import DashboardAcciones from "../components/recepcionistas/dashboardAcciones";
import DashboardMedicos from "../components/recepcionistas/dashboardMedicos";
import DashboardEspecialidades from "../components/recepcionistas/dashboardEspecialidades";
import DashboardTurnosEspecialidad from "../components/recepcionistas/dashboardTurnosEspecialidad";

import { ITurno } from "../types/Turno.type";
import { IMedico } from "../types/Medico.type";
import { IEspecialidad } from "../types/Especialidad.type";
import { toast } from 'sonner';
import {clientesAxios} from "../config/axios";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState("");

    const { response: response, data: turnos, setData: setTurnos, isLoading } = useFetch<ITurno[]>('/turnos');
    console.log("Turnos en DashboardRecepcion:", turnos);
    console.log("Response en DashboardRecepcion:", response);

    const {data: medicos = [], isLoading: loadingMedicos} = useFetch<IMedico[]>("/medicos");
    const {data: especialidades = [], isLoading: loadingEspecialidades} = useFetch<IEspecialidad[]>("/especialidad");
    const turnosFiltrados = (turnos ?? []).filter(
        (turno) =>(turno.pacienteId?.nombre ?? "Paciente sin asignar").toLowerCase().includes(busqueda.toLowerCase())
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
        <Container fluid className="py-4">
            <h2 className="mb-4">
                Dashboard Recepción
            </h2>

            <DashboardMetricas
                turnos={turnos??[]}
                medicos={medicos??[]}
            />
            <Row className="g-4">
                <Col lg={8}>
                    <BuscadorTurnos
                        valor={busqueda}
                        alCambiar={setBusqueda}
                    />
                    <Row className="mt-3">
                        {isLoading ? (
                            [1, 2, 3, 4].map((item) => (
                                <TurnoCardSkeleton key={item} />
                            ))
                        ) : (
                            turnosFiltrados.map((turno) => (
                                <TurnoCard
                                    key={turno.id}
                                    turno={turno}
                                    onAtender={marcarComoAtendido}
                                />
                            ))
                        )}
                    </Row>
                </Col>
                <Col lg={4}>
                    <DashboardAcciones />

                    <DashboardMedicos
                        especialidades={especialidades??[]}
                        medicos={medicos??[]}
                        isLoading={loadingMedicos??[]}
                    />

                    <DashboardEspecialidades
                        especialidades={especialidades??[]}
                        isLoading={loadingEspecialidades}
                    />

                    <DashboardTurnosEspecialidad
                        turnos={turnos??[]}
                    />

                </Col>

            </Row>

        </Container>
    );
};

export default DashboardRecepcion;
