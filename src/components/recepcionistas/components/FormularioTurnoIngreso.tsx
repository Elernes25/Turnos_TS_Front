import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';
import { useFetch } from '../../../hooks/useFetch';
import { useDisponibilidadMedico } from '../../../hooks/useDisponibilidadMedico';
import type { IEspecialidad } from '../../../types/Especialidad.type';
import type { IMedico } from '../../../types/Medico.type';
import type { IcrearPacienteDTO } from '../../../types/Paciente.type';
import { obtenerHorarios, obtenerClaveFecha, horarioYaPaso } from '../../utils/agendaUtils';
import type { HorarioDisponible } from '../../../types/Agenda.types';
import CalendarioTurnos from '../../turnos/components/CalendarioTurnos';
import styles from '../../pacientes/FormularioPaciente.module.scss';

const formularioTurnoIngresoSchema = z.object({
    especialidadId: z.string().min(1, 'La especialidad es obligatoria'),
    medicoId: z.string().min(1, 'El médico es obligatorio'),
    fechaTurno: z.string()
        .min(1, 'La fecha y hora son obligatorias')
        .refine((fecha) => {
            const fechaConvertida = new Date(fecha);
            return !Number.isNaN(fechaConvertida.getTime()) && fechaConvertida.getTime() > Date.now();
        }, 'La fecha del turno debe ser futura'),
    observaciones: z.string().max(280, 'Máximo 280 caracteres'),
});

export type IFormularioTurnoIngresoDTO = z.infer<typeof formularioTurnoIngresoSchema>;

interface FormularioTurnoIngresoProps {
    paciente: IcrearPacienteDTO;
    onCancelar: () => void;
    onConfirmar: (datos: IFormularioTurnoIngresoDTO) => Promise<void>;
}

const valoresIniciales: IFormularioTurnoIngresoDTO = {
    especialidadId: '',
    medicoId: '',
    fechaTurno: '',
    observaciones: '',
};

const FormularioTurnoIngreso = ({
    paciente,
    onCancelar,
    onConfirmar,
}: FormularioTurnoIngresoProps) => {
    const { data: especialidadesData, isLoading: cargandoEspecialidades } =
        useFetch<IEspecialidad[]>('/especialidad');
    const { data: medicosData, isLoading: cargandoMedicos } = useFetch<IMedico[]>('/medicos');
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<IFormularioTurnoIngresoDTO>({
        resolver: zodResolver(formularioTurnoIngresoSchema),
        mode: 'onChange',
        defaultValues: valoresIniciales,
    });

    const especialidades = especialidadesData ?? [];
    const medicos = medicosData ?? [];
    const especialidadId = watch('especialidadId');
    const medicoId = watch('medicoId');
    const fechaTurno = watch('fechaTurno');
    const {
        agenda,
        turnosOcupados,
        cargandoDisponibilidad,
        errorDisponibilidad,
    } = useDisponibilidadMedico(medicoId);

    const [fechaSeleccionada, setFechaSeleccionada] = useState('');
    const [ahora, setAhora] = useState(() => new Date());
    const [mesVisible, setMesVisible] = useState(() => {
        const hoy = new Date();
        return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    });

    useEffect(() => {
        const intervalo = window.setInterval(() => setAhora(new Date()), 30_000);
        return () => window.clearInterval(intervalo);
    }, []);

    const especialidadesDisponibles = useMemo(() => {
        if (!medicoId) return especialidades;
        const medico = medicos.find((item) => item.id === medicoId);
        const idsEspecialidades = new Set(medico?.especialidad.map((item) => item.id) ?? []);
        return especialidades.filter((item) => idsEspecialidades.has(item.id));
    }, [especialidades, medicoId, medicos]);

    useEffect(() => {
        if (!especialidadId || !medicoId || !agenda || cargandoDisponibilidad) return;

        const fechaInicial = new Date();
        fechaInicial.setHours(0, 0, 0, 0);

        for (let dias = 0; dias <= 365; dias += 1) {
            const fecha = new Date(fechaInicial);
            fecha.setDate(fechaInicial.getDate() + dias);
            const horarioDisponible = obtenerHorarios(fecha, agenda, turnosOcupados, new Date())
                .find((horario) => !horario.ocupado && !horario.pasado);

            if (horarioDisponible) {
                setFechaSeleccionada(obtenerClaveFecha(fecha));
                setMesVisible(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
                setValue('fechaTurno', horarioDisponible.fecha.toISOString(), {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                return;
            }
        }

        setFechaSeleccionada('');
        setValue('fechaTurno', '', { shouldValidate: true });
    }, [
        agenda,
        cargandoDisponibilidad,
        especialidadId,
        medicoId,
        setValue,
        turnosOcupados,
    ]);

    const tieneSelecciones = Boolean(especialidadId && medicoId);

    const cambiarEspecialidad = (idEspecialidad: string): void => {
        setValue('especialidadId', idEspecialidad, { shouldDirty: true, shouldValidate: true });
        const primerMedico = medicos.find((medico) =>
            medico.especialidad.some((especialidad) => especialidad.id === idEspecialidad),
        );
        setValue('medicoId', primerMedico?.id ?? '', { shouldDirty: true, shouldValidate: true });
    };

    const cambiarMedico = (idMedico: string): void => {
        setValue('medicoId', idMedico, { shouldDirty: true, shouldValidate: true });
        const medico = medicos.find((item) => item.id === idMedico);
        setValue('especialidadId', medico?.especialidad[0]?.id ?? '', {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const seleccionarFecha = (fecha: Date): void => {
        setFechaSeleccionada(obtenerClaveFecha(fecha));
        setValue('fechaTurno', '', { shouldDirty: true, shouldValidate: true });
    };

    const seleccionarHorario = (horario: HorarioDisponible): void => {
        setValue('fechaTurno', horario.fecha.toISOString(), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const enviarTurno = async (datos: IFormularioTurnoIngresoDTO): Promise<void> => {
        if (horarioYaPaso(new Date(datos.fechaTurno))) {
            toast.error('Seleccioná una fecha y hora futuras.');
            return;
        }

        await onConfirmar(datos);
    };

    return (
        <section aria-labelledby="titulo-cargar-turno">
            <h3 id="titulo-cargar-turno">Cargar turno</h3>
            <Alert variant="info">
                El turno se asociará al paciente cuyos datos cargaste en el paso anterior.
                El paciente y el turno se guardarán juntos al confirmar.
                <div className="mt-2">
                    <strong>{paciente.nombre}</strong>
                    <span className="ms-2">DNI: {paciente.dni}</span>
                </div>
            </Alert>
            <Form onSubmit={handleSubmit(enviarTurno)} noValidate>
                <p className="text-body-secondary">
                    Elegí la especialidad, el médico y un horario disponible para el paciente.
                </p>

                <Row className="g-3">
                    <Col md={6}>
                        <Form.Group controlId="especialidadId">
                            <Form.Label>Especialidad</Form.Label>
                            <Form.Select
                                value={especialidadId}
                                isInvalid={Boolean(errors.especialidadId)}
                                disabled={cargandoEspecialidades || cargandoMedicos}
                                onChange={(evento) => cambiarEspecialidad(evento.target.value)}
                            >
                                <option value="">
                                    {cargandoEspecialidades
                                        ? 'Cargando especialidades...'
                                        : 'Seleccioná una especialidad'}
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
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="medicoId">
                            <Form.Label>Médico</Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Select
                                    value={medicoId}
                                    isInvalid={Boolean(errors.medicoId)}
                                    disabled={cargandoMedicos}
                                    onChange={(evento) => cambiarMedico(evento.target.value)}
                                >
                                    <option value="">
                                        {cargandoMedicos ? 'Cargando médicos...' : 'Seleccioná un médico'}
                                    </option>
                                    {medicos
                                        .filter((medico) =>
                                            !especialidadId
                                            || medico.especialidad.some(
                                                (especialidad) => especialidad.id === especialidadId,
                                            ),
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
                                        onClick={() => cambiarMedico('')}
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {errors.medicoId?.message}
                            </Form.Control.Feedback>
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

                <Form.Group className={`${styles.grupoCampo} mt-3`} controlId="observaciones">
                    <Form.Label>Observaciones (opcional)</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={280}
                        isInvalid={Boolean(errors.observaciones)}
                        {...register('observaciones')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.observaciones?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                {cargandoDisponibilidad && (
                    <div className="text-center mt-3">
                        <Spinner animation="border" size="sm" role="status">
                            <span className="visually-hidden">Cargando disponibilidad...</span>
                        </Spinner>
                    </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button type="button" variant="outline-secondary" onClick={onCancelar}>
                        Volver al paciente
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting
                            || !especialidadId
                            || !medicoId
                            || !fechaTurno
                            || cargandoDisponibilidad
                            || Boolean(errorDisponibilidad)
                        }
                    >
                        {isSubmitting ? 'Cargando turno...' : 'Confirmar turno'}
                    </Button>
                </div>
            </Form>
        </section>
    );
};

export default FormularioTurnoIngreso;
