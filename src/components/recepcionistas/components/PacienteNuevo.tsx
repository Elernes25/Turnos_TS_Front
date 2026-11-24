import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'react-bootstrap';
import { toast } from 'sonner';
import { clientesAxios } from '../../../config/axios';
import { obtenerMensajeError } from '../../utils/obtenerMensajeError';
import {
    crearPacienteSchema,
    TipoTelefono,
    type IcrearPacienteDTO,
} from '../../../types/Paciente.type';
import DatosPersonales from '../../pacientes/components/DatosPersonales';
import DireccionPaciente from '../../pacientes/components/DireccionPaciente';
import TelefonoPaciente from '../../pacientes/components/TelefonoPaciente';
import ObraSocialPaciente from '../../obraSocial/ObraSocialPaciente';
import FormularioTurnoIngreso, {
    type IFormularioTurnoIngresoDTO,
} from './FormularioTurnoIngreso';
import styles from '../../pacientes/FormularioPaciente.module.scss';

interface PacienteNuevoProps {
    initialDni?: string;
    onCancelar: () => void;
    onCompletado: () => void;
}

const obtenerValoresIniciales = (dni = ''): IcrearPacienteDTO => ({
    nombre: '',
    dni,
    fechaDeNacimiento: '',
    email: '',
    direccion: {
        calle: '',
        numero: '',
        piso: '',
        departamento: '',
    },
    telefono: {
        tipo: TipoTelefono.CELULAR,
        codigoPais: '54',
        codigoArea: '3777',
        numero: '',
    },
    obraSocial: {
        obraSocialID: '',
        numeroAfiliado: '',
    },
});

const PacienteNuevo = ({
    initialDni = '',
    onCancelar,
    onCompletado,
}: PacienteNuevoProps) => {
    const [datosPacientePendiente, setDatosPacientePendiente] =
        useState<IcrearPacienteDTO | null>(null);
    const [mostrarFormularioTurno, setMostrarFormularioTurno] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<IcrearPacienteDTO>({
        resolver: zodResolver(crearPacienteSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: obtenerValoresIniciales(initialDni),
    });

    const abrirFormularioTurno = (datosPaciente: IcrearPacienteDTO): void => {
        setDatosPacientePendiente(datosPaciente);
        setMostrarFormularioTurno(true);
    };

    const confirmarIngreso = async (datosTurno: IFormularioTurnoIngresoDTO): Promise<void> => {
        if (!datosPacientePendiente) {
            toast.error('No se encontraron los datos del paciente para completar el ingreso.');
            return;
        }

        try {
            await clientesAxios.post('/recepcion', {
                datosPaciente: datosPacientePendiente,
                especialidadId: datosTurno.especialidadId,
                medicoId: datosTurno.medicoId,
                fechaTurno: datosTurno.fechaTurno,
                estado: 'pendiente',
                observaciones: datosTurno.observaciones,
            });

            toast.success('Paciente y turno cargados correctamente.');
            onCompletado();
        } catch (error: unknown) {
            toast.error(obtenerMensajeError(error));
        }
    };

    return (
        <div className={`${styles.contenedorFormulario} ${styles.contenedorIngreso}`}>
            {mostrarFormularioTurno && datosPacientePendiente ? (
                <FormularioTurnoIngreso
                    paciente={datosPacientePendiente}
                    onCancelar={() => setMostrarFormularioTurno(false)}
                    onConfirmar={confirmarIngreso}
                />
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Datos del nuevo paciente</h2>
                        <Button type="button" variant="outline-secondary" onClick={onCancelar}>
                            Volver a búsqueda
                        </Button>
                    </div>

                    <Form onSubmit={handleSubmit(abrirFormularioTurno)} noValidate>
                        <DatosPersonales register={register} errores={errors} styles={styles} />
                        <DireccionPaciente register={register} errores={errors} styles={styles} />
                        <TelefonoPaciente register={register} errores={errors} styles={styles} />
                        <ObraSocialPaciente
                            control={control}
                            register={register}
                            errores={errors}
                            styles={styles}
                            setValue={setValue}
                        />

                        <Alert variant="info">
                            El paciente y el turno se guardarán juntos al confirmar el turno.
                        </Alert>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" disabled={isSubmitting}>
                                Cargar Turno
                            </Button>
                        </div>
                    </Form>
                </>
            )}
        </div>
    );
};

export default PacienteNuevo;
