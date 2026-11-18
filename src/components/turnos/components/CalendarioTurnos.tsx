import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useMemo } from "react";
import type { IAgenda } from "../../../types/Agenda.types";
import { obtenerHorarios, obtenerClaveFecha} from "../../utils/agendaUtils";
import type { TurnoOcupado, HorarioDisponible} from "../../../types/Agenda.types";


interface CalendarioTurnosProps {
    tieneSelecciones: boolean;
    cargandoDisponibilidad: boolean;
    errorDisponibilidad: string;
    agenda: IAgenda | null;
    turnosOcupados: TurnoOcupado[];
    fechaSeleccionada: string;
    fechaTurno: string;
    ahora: Date;
    mesVisible: Date;

    onMesVisibleChange: (fecha: Date) => void;
    onSeleccionarFecha: (fecha: Date) => void;
    onSeleccionarHorario: (horario: HorarioDisponible) => void;

    errorFechaTurno?: string;
}
 const CalendarioTurnos = ({
    tieneSelecciones,
    cargandoDisponibilidad,
    errorDisponibilidad,
    agenda,
    turnosOcupados,
    fechaSeleccionada,
    fechaTurno,
    ahora,
    mesVisible,
    onMesVisibleChange,
    onSeleccionarFecha,
    onSeleccionarHorario,
    errorFechaTurno,
}: CalendarioTurnosProps) => {

    const diasDelCalendario = useMemo(() => {
        const primerDia = new Date(
            mesVisible.getFullYear(),
            mesVisible.getMonth(),
            1,
        );

        const desplazamiento = primerDia.getDay();
        const inicio = new Date(primerDia);
        inicio.setDate(primerDia.getDate() - desplazamiento);
        return Array.from({ length: 42 }, (_, indice) => {
            const dia = new Date(inicio);
            dia.setDate(inicio.getDate() + indice);
            return dia;
        });
    }, [mesVisible]);


    const horariosFechaSeleccionada = useMemo(() => {
        if (!agenda || !fechaSeleccionada) return [];

        const [anio, mes, dia] =
            fechaSeleccionada.split("-").map(Number);

        return obtenerHorarios(
            new Date(anio, mes - 1, dia),
            agenda,
            turnosOcupados,
            ahora,
        );
    }, [
        agenda,
        ahora,
        fechaSeleccionada,
        turnosOcupados,
    ]);

    const nombreDia = [ "Do","Lu", "Ma", "Mi","Ju","Vi", "Sá", ];
   
    const anteriorMes = (): void => {
        onMesVisibleChange(
            new Date(
                mesVisible.getFullYear(),
                mesVisible.getMonth() - 1,
                1,
            ),
        );
    };

    const siguienteMes = (): void => {
        onMesVisibleChange(
            new Date(
                mesVisible.getFullYear(),
                mesVisible.getMonth() + 1,
                1,
            ),
        );
    };

    return (
        <section className="mt-4" aria-labelledby="seleccion-fecha">
        <h4 id="seleccion-fecha">Fecha y horario</h4>
        {!tieneSelecciones && (
            <Alert variant="info">
                Seleccioná paciente, especialidad y médico para consultar la disponibilidad.
            </Alert>
        )}
        {tieneSelecciones && cargandoDisponibilidad && (
            <div className="d-flex align-items-center gap-2 mb-3">
                <Spinner size="sm" />
                <span>Cargando agenda y horarios ocupados...</span>
            </div>
        )}
        {errorDisponibilidad && <Alert variant="danger">{errorDisponibilidad}</Alert>}
        {tieneSelecciones && !cargandoDisponibilidad && !errorDisponibilidad && agenda && (
            <>
                <Card className="mb-3">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Button
                                type="button"
                                variant="outline-secondary"
                                size="sm"
                                onClick={anteriorMes}
                                disabled={
                                    mesVisible.getFullYear() === new Date().getFullYear()
                                    && mesVisible.getMonth() === new Date().getMonth()
                                }
                                aria-label="Mes anterior"
                            >
                                ‹
                            </Button>
                            <strong className="text-capitalize">
                                {mesVisible.toLocaleDateString("es-AR", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </strong>
                            <Button
                                type="button"
                                variant="outline-secondary"
                                size="sm"
                                onClick={siguienteMes}
                                aria-label="Mes siguiente"
                            >
                                ›
                            </Button>
                        </div>
                        <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
                            {nombreDia.map((dia, indice) => (
                                <div key={`${dia}-${indice}`} className="text-center small fw-bold py-2">
                                    {dia}
                                </div>
                            ))}
                            {diasDelCalendario.map((dia) => {
                                const fueraDelMes = dia.getMonth() !== mesVisible.getMonth();
                                const hoy = new Date();
                                hoy.setHours(0, 0, 0, 0);
                                const fechaPasada = dia < hoy;
                                const horarios = obtenerHorarios(dia, agenda, turnosOcupados, ahora);
                                const sinDisponibilidad = !horarios.some(
                                    (horario) => !horario.ocupado && !horario.pasado,
                                );
                                const deshabilitado = fueraDelMes || fechaPasada || sinDisponibilidad;
                                const claveFecha = obtenerClaveFecha(dia);
                                const seleccionado = fechaSeleccionada === claveFecha;

                                return (
                                    <Button
                                        key={claveFecha}
                                        type="button"
                                        variant={seleccionado ? "success": sinDisponibilidad ? "light" : "outline-success" }
                                        className={`rounded-0 p-1 ${sinDisponibilidad ? "" : "fw-semibold"}`}
                                        disabled={deshabilitado}
                                        aria-pressed={seleccionado}
                                        title={
                                            fechaPasada
                                                ? "No se pueden elegir fechas pasadas"
                                                : sinDisponibilidad && !fueraDelMes
                                                    ? "El médico no atiende este día o no hay horarios disponibles"
                                                    : undefined
                                        }
                                        onClick={() => onSeleccionarFecha(dia)}
                                    >
                                        {dia.getDate()}
                                    </Button>
                                );
                            })}
                        </div>
                    </Card.Body>
                </Card>

                {fechaSeleccionada && (
                    <div>
                        <h5 className="mb-3">
                            Horarios del{" "}
                            {new Date(`${fechaSeleccionada}T00:00:00`).toLocaleDateString("es-AR")}
                        </h5>
                        {horariosFechaSeleccionada.length === 0 ? (
                            <Alert variant="warning">
                                El médico no atiende en la fecha seleccionada.
                            </Alert>
                        ) : (
                            <Row className="row-cols-2 row-cols-sm-3 row-cols-md-5 g-2">
                                {horariosFechaSeleccionada.map((horario) => {
                                    const disponible = !horario.ocupado && !horario.pasado;
                                    const seleccionado = fechaTurno === horario.fecha.toISOString();
                                    const variante = horario.pasado
                                        ? "secondary"
                                        : horario.ocupado
                                            ? "danger"
                                            : seleccionado
                                                ? "success"
                                                : "outline-success";

                                    return (
                                        <Col key={horario.hora}>
                                            <Button
                                                type="button"
                                                variant={variante}
                                                className="w-100 h-100"
                                                disabled={!disponible}
                                                aria-pressed={seleccionado}
                                                onClick={() => onSeleccionarHorario(horario)}
                                            >
                                                <span className="d-block fw-bold">{horario.hora}</span>
                                                <small>
                                                    {horario.pasado
                                                        ? "Pasado"
                                                        : horario.ocupado
                                                            ? "Ocupado"
                                                            : "Disponible"}
                                                </small>
                                            </Button>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </div>
                )}
            </>
        )}
        {tieneSelecciones && !cargandoDisponibilidad && !errorDisponibilidad && !agenda && (
            <Alert variant="warning">
                Este médico no tiene una agenda cargada.
            </Alert>
        )}
        {errorFechaTurno && (
            <Form.Control.Feedback  type="invalid" className="d-block mt-2"  >
                {errorFechaTurno}
            </Form.Control.Feedback>
        )}
    </section>
    );
};

export default CalendarioTurnos;
