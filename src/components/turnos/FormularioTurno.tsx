import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { clientesAxios } from "../../config/axios";
import { useFetch } from "../../hooks/useFetch";
import type { IEspecialidad } from "../../types/Especialidad.type";
import type { IMedico } from "../../types/Medico.type";
import type { IPaciente } from "../../types/Paciente.type";
import { crearTurnoSchema , type  ICrearTurnoDTO} from "../../types/Turno.type";
import styles from "../pacientes/FormularioPaciente.module.scss";
import { useDisponibilidadMedico } from "../../hooks/useDisponibilidadMedico";
import CalendarioTurnos from "./components/CalendarioTurnos";
import { obtenerHorarios, obtenerClaveFecha, horarioYaPaso } from "../utils/agendaUtils";
import type { HorarioDisponible } from "../../types/Agenda.types";
import TicketTurno from "./components/TicketTurno";
import type { ITicketTurno } from "../../types/TicketTurno.types";

const normalizarTexto = (texto: string): string =>
    texto.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

const FormularioTurno = () => {
    const { id: pacienteIdParam } = useParams<{ id: string }>();
    const { data: pacientesData, isLoading: cargandoPacientes } = useFetch<IPaciente[]>("/pacientes");
    const { data: especialidadesData, isLoading: cargandoEspecialidades } = useFetch<IEspecialidad[]>("/especialidad");
    const { data: medicosData, isLoading: cargandoMedicos } = useFetch<IMedico[]>("/medicos");
    const { register, handleSubmit, reset,setValue, watch, formState: { errors, isSubmitting },
    } = useForm<ICrearTurnoDTO>({ resolver: zodResolver(crearTurnoSchema), mode: "onChange",
        defaultValues: {
            pacienteId: pacienteIdParam ?? "",
            especialidadId: "",
            medicoId: "",
            fechaTurno: "",
            observaciones: "",
        },
    });

    const pacientes = pacientesData ?? [];
    const pacienteFijado = pacientes.find((paciente) => paciente.id === pacienteIdParam);
    const pacienteDeRutaNoEncontrado = Boolean(pacienteIdParam)
        && !cargandoPacientes
        && !pacienteFijado;
    const especialidades = especialidadesData ?? [];
    const medicos = medicosData ?? [];
    const pacienteId = watch("pacienteId");
    const especialidadId = watch("especialidadId");
    const medicoId = watch("medicoId") ?? "";
    const fechaTurno = watch("fechaTurno");

    const { agenda, turnosOcupados, cargandoDisponibilidad, errorDisponibilidad,
    } = useDisponibilidadMedico(medicoId); // llama al hook

    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [turnoRegistrado, setTurnoRegistrado] = useState<ITicketTurno | null>(null);
    const [busquedaPaciente, setBusquedaPaciente] = useState("");
    const [ahora, setAhora] = useState(() => new Date());
    const [mesVisible, setMesVisible] = useState(() => {
        const hoy = new Date();
        return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    });

    useEffect(() => {
        const intervalo = window.setInterval(() => setAhora(new Date()), 30_000);
        return () => window.clearInterval(intervalo);
    }, []);

    useEffect(() => {
        if (pacienteIdParam) {
            setValue("pacienteId", pacienteIdParam, { shouldValidate: true });
        }
    }, [pacienteIdParam, setValue]);

    const resultadosPacientes = useMemo(() => {
        const termino = normalizarTexto(busquedaPaciente);
        if (!termino) return [];

        return pacientes
            .filter((paciente) =>
                normalizarTexto(paciente.nombre).includes(termino)
                || normalizarTexto(paciente.dni).includes(termino),
            )
            .slice(0, 8);
    }, [busquedaPaciente, pacientes]);

    const seleccionarPaciente = (paciente: IPaciente): void => {
        setBusquedaPaciente(`${paciente.nombre} · DNI ${paciente.dni}`);
        setValue("pacienteId", paciente.id, { shouldDirty: true, shouldValidate: true });
    };

    const buscarPaciente = (valor: string): void => {
        setBusquedaPaciente(valor);
        setValue("pacienteId", "", { shouldDirty: true, shouldValidate: true });
    };

    const especialidadesDisponibles = useMemo(() => {
        if (!medicoId) return especialidades;
        const medico = medicos.find((item) => item.id === medicoId);
        const idsEspecialidades = new Set(medico?.especialidad.map((item) => item.id) ?? []);
        return especialidades.filter((item) => idsEspecialidades.has(item.id));
    }, [especialidades, medicoId, medicos]);
  
    useEffect(() => {
        if (!pacienteId || !especialidadId || !medicoId || !agenda || cargandoDisponibilidad) return;

        const fechaInicial = new Date();
        fechaInicial.setHours(0, 0, 0, 0);

        for (let dias = 0; dias <= 365; dias += 1) {
            const fecha = new Date(fechaInicial);
            fecha.setDate(fechaInicial.getDate() + dias);
            const horarioDisponible = obtenerHorarios(fecha, agenda, turnosOcupados, new Date())
                .find((horario) => !horario.ocupado && !horario.pasado);

            if (horarioDisponible) {
                const claveFecha = obtenerClaveFecha(fecha);
                setFechaSeleccionada(claveFecha);
                setMesVisible(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
                setValue("fechaTurno", horarioDisponible.fecha.toISOString(), {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                return;
            }
        }
        setFechaSeleccionada("");
        setValue("fechaTurno", "", { shouldValidate: true });
    }, [agenda, cargandoDisponibilidad, especialidadId, medicoId, pacienteId, setValue, turnosOcupados]);

    const tieneSelecciones = Boolean(pacienteId && especialidadId && medicoId);

    const cambiarEspecialidad = (idEspecialidad: string): void => {
        setValue("especialidadId", idEspecialidad, { shouldDirty: true, shouldValidate: true });
        const primerMedico = medicos.find((medico) =>
            medico.especialidad.some((especialidad) => especialidad.id === idEspecialidad),
        );
        setValue("medicoId", primerMedico?.id ?? "", { shouldDirty: true, shouldValidate: true });
    };

    const cambiarMedico = (idMedico: string): void => {
        setValue("medicoId", idMedico, { shouldDirty: true, shouldValidate: true });
        const medico = medicos.find((item) => item.id === idMedico);
        const primeraEspecialidad = medico?.especialidad[0]?.id ?? "";
        setValue("especialidadId", primeraEspecialidad, { shouldDirty: true, shouldValidate: true });
    };

    const seleccionarFecha = (fecha: Date): void => {
        const claveFecha = obtenerClaveFecha(fecha);
        setFechaSeleccionada(claveFecha);
        setValue("fechaTurno", "", { shouldDirty: true, shouldValidate: true });
    };

    const seleccionarHorario = (horario: HorarioDisponible): void => {
        setValue("fechaTurno", horario.fecha.toISOString(), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const onSubmit = async (datos: ICrearTurnoDTO): Promise<void> => {
        if (pacienteDeRutaNoEncontrado) {
            toast.error("No se encontró el paciente seleccionado.");
            return;
        }
        if (!datos.medicoId) {
            toast.error("Seleccioná un médico para el turno.");
            return;
        }
        if (horarioYaPaso(new Date(datos.fechaTurno))) {
            toast.error("Seleccioná una fecha y hora futuras.");
            return;
        }

        try {
            const fecha = new Date(datos.fechaTurno);
            await clientesAxios.post("/turnos/", {
                pacienteId: datos.pacienteId,
                especialidadId: datos.especialidadId,
                medicoId: datos.medicoId,
                fechaTurno: datos.fechaTurno,
                estado: "pendiente",
                activo: true,
                observaciones: "",
            });
            setTurnoRegistrado({
                paciente: pacientes.find((item) => item.id === datos.pacienteId)?.nombre ?? "No disponible",
                especialidad: especialidades.find((item) => item.id === datos.especialidadId)?.nombre ?? "No disponible",
                medico: medicos.find((item) => item.id === datos.medicoId)?.nombre ?? "No disponible",
                fecha: new Intl.DateTimeFormat("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "America/Argentina/Buenos_Aires",
                }).format(fecha),
                hora: new Intl.DateTimeFormat("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "America/Argentina/Buenos_Aires",
                }).format(fecha),
            });
            reset();
            setBusquedaPaciente("");
            setFechaSeleccionada("");
        } catch (error: unknown) {
            const mensaje = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Error del servidor al crear el turno."
                : "El servidor está apagado o no responde.";
            toast.error(mensaje);
        }
    };

    return (
        <div className={`${styles.contenedorFormulario} mx-auto my-4`}>
            <h3>Nuevo Turno</h3>
            <p className="text-center text-body-secondary mb-4">
                Completá los datos del paciente y elegí un horario disponible para reservar el turno.
            </p>

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Row className="g-3">
                    <Col md={12}>
                        <Form.Group controlId="pacienteId">
                            <Form.Label>Paciente</Form.Label>
                            {pacienteIdParam ? (
                                <>
                                    <input
                                        type="hidden"
                                        value={pacienteIdParam}
                                        {...register("pacienteId")}
                                    />
                                    <Form.Control
                                        readOnly
                                        value={
                                            cargandoPacientes
                                                ? "Cargando paciente..."
                                                : pacienteFijado
                                                    ? `${pacienteFijado.nombre} · DNI ${pacienteFijado.dni}`
                                                    : "Paciente no encontrado"
                                        }
                                        isInvalid={pacienteDeRutaNoEncontrado}
                                    />
                                </>
                            ) : (
                                <div className="position-relative">
                                    <Form.Control
                                        type="search"
                                        value={busquedaPaciente}
                                        onChange={(evento) => buscarPaciente(evento.target.value)}
                                        placeholder="Buscá por nombre o DNI"
                                        disabled={cargandoPacientes}
                                        isInvalid={!!errors.pacienteId}
                                        aria-label="Buscar paciente por nombre o DNI"
                                    />
                                    {busquedaPaciente.trim() && !pacienteId && resultadosPacientes.length > 0 && (
                                        <div
                                            className="position-absolute start-0 end-0 border rounded-bottom bg-white shadow-sm"
                                            style={{ zIndex: 1000, maxHeight: "260px", overflowY: "auto" }}
                                            role="listbox"
                                            aria-label="Resultados de pacientes"
                                        >
                                            {resultadosPacientes.map((paciente) => (
                                                <button
                                                    key={paciente.id}
                                                    type="button"
                                                    className="btn btn-light w-100 text-start rounded-0 border-0 px-3 py-2"
                                                    role="option"
                                                    aria-selected="false"
                                                    onClick={() => seleccionarPaciente(paciente)}
                                                >
                                                    <strong>{paciente.nombre}</strong>
                                                    <span className="ms-2 text-body-secondary">DNI {paciente.dni}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {busquedaPaciente.trim()
                                        && !pacienteId
                                        && !cargandoPacientes
                                        && resultadosPacientes.length === 0 && (
                                            <div className="small text-body-secondary mt-2">
                                                No se encontraron pacientes con esos datos.
                                            </div>
                                        )}
                                </div>
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.pacienteId?.message}
                            </Form.Control.Feedback>
                            {pacienteDeRutaNoEncontrado && (
                                <Form.Text className="text-danger">
                                    No se pudo cargar el paciente indicado en la ruta.
                                </Form.Text>
                            )}
                            <Form.Text className="text-body-secondary">
                                {pacienteIdParam
                                    ? "El turno se reservará para este paciente."
                                    : "Elegí el paciente para quien se reservará el turno."}
                            </Form.Text>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="especialidadId">
                            <Form.Label>Especialidad</Form.Label>
                            <Form.Select
                                value={especialidadId}
                                isInvalid={!!errors.especialidadId}
                                disabled={cargandoEspecialidades || cargandoMedicos}
                                onChange={(evento) => cambiarEspecialidad(evento.target.value)}
                            >
                                <option value="">
                                    {cargandoEspecialidades ? "Cargando especialidades..." : "Seleccioná una especialidad"}
                                </option>
                                {especialidadesDisponibles.map((especialidad) => (
                                    <option key={especialidad.id} value={especialidad.id}>
                                        {especialidad.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.especialidadId?.message}
                            </Form.Control.Feedback>
                            <Form.Text className="text-body-secondary">
                                Al elegirla se asignará el primer médico disponible de esa especialidad.
                            </Form.Text>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="medicoId">
                            <Form.Label>Médico</Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Select
                                    value={medicoId}
                                    disabled={cargandoMedicos}
                                    onChange={(evento) => cambiarMedico(evento.target.value)}
                                >
                                    <option value="">
                                        {cargandoMedicos ? "Cargando médicos..." : "Seleccioná un médico"}
                                    </option>
                                    {medicos
                                        .filter((medico) =>
                                            !especialidadId
                                            || medico.especialidad.some((especialidad) => especialidad.id === especialidadId),
                                        )
                                        .map((medico) => (
                                            <option key={medico.id} value={medico.id}>
                                                {medico.nombre}
                                            </option>
                                        ))}
                                </Form.Select>
                                {medicoId && (
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        aria-label="Quitar médico seleccionado"
                                        title="Quitar médico y volver a ver todas las especialidades"
                                        onClick={() => cambiarMedico("")}
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                            <Form.Text className="text-body-secondary">
                                También podés elegir primero un médico; se mostrarán sus especialidades.
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <CalendarioTurnos
                    tieneSelecciones={tieneSelecciones}
                    cargandoDisponibilidad={cargandoDisponibilidad}
                    errorDisponibilidad={errorDisponibilidad}
                    agenda={agenda}
                    turnosOcupados={turnosOcupados}
                    fechaSeleccionada={fechaSeleccionada}
                    fechaTurno={fechaTurno}
                    ahora={ahora}
                    mesVisible={mesVisible}
                    onMesVisibleChange={setMesVisible}
                    onSeleccionarFecha={seleccionarFecha}
                    onSeleccionarHorario={seleccionarHorario}
                    errorFechaTurno={errors.fechaTurno?.message}
                />

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting
                            || !pacienteId
                            || !especialidadId
                            || !medicoId
                            || pacienteDeRutaNoEncontrado
                            || cargandoPacientes
                            || !fechaTurno
                            || cargandoDisponibilidad
                            || !!errorDisponibilidad
                        }
                    >
                        {isSubmitting ? "Guardando..." : "Guardar Turno"}
                    </Button>
                </div>
            </Form>

            <TicketTurno
                turnoRegistrado={turnoRegistrado}
                onClose={() => setTurnoRegistrado(null)}
            />

        </div>
    );
};

export default FormularioTurno;