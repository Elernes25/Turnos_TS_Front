import { useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Form } from 'react-bootstrap';
import { toast } from 'sonner';
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';
import { clientesAxios } from '../../config/axios';
import { crearPacienteSchema, TipoTelefono, type IcrearPacienteDTO, type IPaciente,
} from '../../types/Paciente.type';
import type { IObraSocial } from '../../types/ObraSocial.type';
import DireccionPaciente from './components/DireccionPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import styles from './FormularioPaciente.module.scss';

const normalizar = (texto: string): string =>
    texto.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();

const obtenerId = (valor: unknown): string => {
    if (typeof valor === 'string') return valor;
    if (!valor || typeof valor !== 'object') return '';

    const referencia = valor as Record<string, unknown>;
    return obtenerId(referencia.id || referencia._id || referencia.$oid);
};

const obtenerIdObraSocial = (obraSocial: IObraSocial): string =>
    obtenerId(obraSocial.id || (obraSocial as IObraSocial & { _id?: string })._id);

const EditarPaciente = () => {
    const referenciaBusqueda = useRef<HTMLInputElement>(null);
    const { data: pacientesData, isLoading: cargandoPacientes,} = useFetch<IPaciente[]>('/pacientes');
    const { data: obrasSocialesData, setData: setObrasSocialesData, isLoading: cargandoObrasSociales,} = useFetch<IObraSocial[]>('/obraSocial');
    const [busqueda, setBusqueda] = useState('');
   
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState<IPaciente | null>(null);
    const [cargandoObraSocialPorId, setCargandoObraSocialPorId] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting },
    } = useForm<IcrearPacienteDTO>({ resolver: zodResolver(crearPacienteSchema),
        mode: 'onChange',
        defaultValues: {
            nombre: '',
            dni: '',
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
                codigoArea: '',
                numero: '',
            },
            obraSocial: {
                obraSocialID: '',
                numeroAfiliado: '',
            },
        },
    });

    const resultados = useMemo(() => {
        const termino = normalizar(busqueda);
        if (!termino || !pacientesData) return [];

        return pacientesData
            .filter((paciente) =>
                normalizar(paciente.nombre).includes(termino)
                || normalizar(paciente.dni).includes(termino),
            )
            .slice(0, 8);
    }, [busqueda, pacientesData]);

    const obtenerReferenciaObraSocial = (paciente: IPaciente): string => {
        const obraSocial = paciente.obraSocial as IPaciente['obraSocial'] & {
            id?: unknown;
            _id?: unknown;
            obraSocialID?: unknown;
            nombre?: string;
        };
        return obtenerId(obraSocial.obraSocialID || obraSocial.id || obraSocial._id);
    };

    const obtenerObraSocialID = (paciente: IPaciente): string => {
        const obraSocial = paciente.obraSocial as IPaciente['obraSocial'] & {
            obraSocialID?: unknown;
            nombre?: string;
        };
        const idExistente = obtenerReferenciaObraSocial(paciente);
        if (idExistente && obrasSocialesData?.some((obra) => obtenerIdObraSocial(obra) === idExistente)) {
            return idExistente;
        }

        const nombre = obraSocial.nombreObraSocial
            || obraSocial.nombre
            || (typeof obraSocial.obraSocialID === 'object'
                && obraSocial.obraSocialID !== null
                && 'nombreObraSocial' in obraSocial.obraSocialID
                && typeof obraSocial.obraSocialID.nombreObraSocial === 'string'
                ? obraSocial.obraSocialID.nombreObraSocial
                : '');
        const obraEncontrada = obrasSocialesData
            ?.find((obra) => normalizar(obra.nombreObraSocial) === normalizar(nombre));
        return obraEncontrada ? obtenerIdObraSocial(obraEncontrada) : '';
    };

    const obtenerNombreObraSocial = (paciente: IPaciente): string => {
        const obraSocial = paciente.obraSocial;
        const referencia = obraSocial.obraSocialID;
        const nombreReferencia = typeof referencia === 'object' && referencia !== null
            ? referencia.nombreObraSocial || referencia.nombre || ''
            : '';
        return obraSocial.nombreObraSocial
            || obraSocial.nombre
            || nombreReferencia
            || '';
    };

    const seleccionarPaciente = async (paciente: IPaciente): Promise<void> => {
        if (!obrasSocialesData) return;

        let obraSocialID = obtenerObraSocialID(paciente);
        const referenciaObraSocial = obtenerReferenciaObraSocial(paciente);

        if (
            referenciaObraSocial
            && !obrasSocialesData.some((obra) => obtenerIdObraSocial(obra) === referenciaObraSocial)
        ) {
            setCargandoObraSocialPorId(true);
            try {
                const respuesta = await clientesAxios.get<{ datos?: unknown }>(
                    `/obraSocial/${referenciaObraSocial}`,
                );
                const detalle = respuesta.data.datos ?? respuesta.data;
                const datos = detalle as Record<string, unknown>;
                const nombreObraSocial = typeof datos.nombreObraSocial === 'string'
                    ? datos.nombreObraSocial
                    : typeof datos.nombre === 'string'
                        ? datos.nombre
                        : '';

                if (!nombreObraSocial) {
                    toast.error('No se pudo identificar la obra social asociada al paciente.');
                    return;
                }

                const obraSocial: IObraSocial = {id: referenciaObraSocial, nombreObraSocial,};
                setObrasSocialesData((obrasActuales) => [
                    ...(obrasActuales ?? []).filter((obra) => obtenerIdObraSocial(obra) !== referenciaObraSocial),obraSocial,
                ]);
                obraSocialID = referenciaObraSocial;
            } catch (error: unknown) {
                const mensaje = axios.isAxiosError<{ message?: string }>(error)
                    ? error.response?.data?.message ?? 'No se pudo cargar la obra social del paciente.'
                    : 'Ocurrió un error inesperado al cargar la obra social del paciente.';
                toast.error(mensaje);
                return;
            } finally {
                setCargandoObraSocialPorId(false);
            }
        }

        reset({
            nombre: paciente.nombre,
            dni: paciente.dni,
            fechaDeNacimiento: paciente.fechaDeNacimiento.slice(0, 10),
            email: paciente.email ?? '',
            direccion: {
                calle: paciente.direccion.calle,
                numero: paciente.direccion.numero,
                piso: paciente.direccion.piso ?? '',
                departamento: paciente.direccion.departamento ?? '',
            },
            telefono: {
                tipo: paciente.telefono.tipo ?? TipoTelefono.CELULAR,
                codigoPais: paciente.telefono.codigoPais,
                codigoArea: paciente.telefono.codigoArea,
                numero: paciente.telefono.numero,
            },
            obraSocial: {
                obraSocialID,
                numeroAfiliado: paciente.obraSocial.numeroAfiliado ?? '',
            },
        });
        setPacienteSeleccionado(paciente);
    };

    const cambiarBusqueda = (valor: string): void => {
        setBusqueda(valor);
        setPacienteSeleccionado(null);
        reset();
    };

    const onSubmit = async (datos: IcrearPacienteDTO): Promise<void> => {
        if (!pacienteSeleccionado) return;

        try {
            await clientesAxios.patch(`/pacientes/${pacienteSeleccionado.id}`, {
                direccion: datos.direccion,
                telefono: datos.telefono,
                obraSocial: datos.obraSocial,
            });
            toast.success('Paciente actualizado correctamente');
            cambiarBusqueda('');
            referenciaBusqueda.current?.focus();
            
        } catch (error: unknown) {
            const mensaje = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message ?? 'Error del servidor al actualizar el paciente.'
                : 'Ocurrió un error inesperado al actualizar el paciente.';
            toast.error(mensaje);
        }
    };

    const obraSocialActual = pacienteSeleccionado
        ? obtenerNombreObraSocial(pacienteSeleccionado)
        : '';
    const obraSocialNoEncontrada = Boolean(
        obraSocialActual
        && normalizar(obraSocialActual) !== 'ninguna'
        && !watch('obraSocial.obraSocialID'),
    );

    return (
        <div className={styles.contenedorFormulario}>
            <h3>Actualizar Paciente</h3>

            <Form.Group className="mb-4" controlId="buscarPaciente">
                <Form.Label>Buscar paciente por nombre o DNI</Form.Label>
                <Form.Control
                    ref={referenciaBusqueda}
                    type="search"
                    value={busqueda}
                    onChange={(evento) => cambiarBusqueda(evento.target.value)}
                    placeholder="Ingresá nombre o DNI"
                    disabled={cargandoPacientes}
                />
                <Form.Text className="text-body-secondary">
                    {cargandoPacientes
                        ? 'Cargando pacientes...'
                        : 'Escribí para buscar y seleccioná el paciente que querés actualizar.'}
                </Form.Text>
            </Form.Group>

            {busqueda.trim() && resultados.length > 0 && !pacienteSeleccionado && (
                <div className={styles.resultadosPacientes} aria-label="Resultados de búsqueda de pacientes">
                    {resultados.map((paciente) => (
                        <button
                            key={paciente.id}
                            type="button"
                            className={styles.resultadoPaciente}
                            onClick={() => seleccionarPaciente(paciente)}
                            disabled={cargandoObrasSociales || cargandoObraSocialPorId || !obrasSocialesData}
                        >
                            <strong>{paciente.nombre}</strong>
                            <span className="ms-2">DNI {paciente.dni}</span>
                        </button>
                    ))}
                </div>
            )}

            {busqueda.trim() && !cargandoPacientes && pacientesData === null && (
                <Alert variant="danger">No se pudo cargar el listado de pacientes.</Alert>
            )}

            {busqueda.trim()
                && !cargandoPacientes
                && pacientesData !== null
                && resultados.length === 0 && (
                    <Alert variant="info">No se encontraron pacientes con esos datos.</Alert>
                )}

            {cargandoObrasSociales && (
                <Alert variant="info">Cargando las obras sociales...</Alert>
            )}
            {!cargandoObrasSociales && obrasSocialesData === null && (
                <Alert variant="danger">
                    No se pudieron cargar las obras sociales. No es posible actualizar el paciente de forma segura.
                </Alert>
            )}

            {pacienteSeleccionado && (
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <p className="mb-4">
                        <strong>{pacienteSeleccionado.nombre}</strong>
                        <span className="ms-2 text-body-secondary">DNI {pacienteSeleccionado.dni}</span>
                    </p>

                    <DireccionPaciente register={register} errores={errors} styles={styles} />
                    <TelefonoPaciente register={register} errores={errors} styles={styles} />

                    <fieldset>
                        <legend>Obra Social</legend>
                        <div className={styles.filaInput}>
                            <div className={styles.grupoCampo}>
                                <small className={styles.ayudaCampo}>
                                    Seleccioná la obra social o prepaga del paciente.
                                </small>
                                <Form.Select
                                    className={styles.campoInput}
                                    disabled={cargandoObrasSociales}
                                    {...register('obraSocial.obraSocialID')}
                                    onChange={(evento) => {
                                        const obraSocialID = evento.target.value;
                                        setValue('obraSocial.obraSocialID', obraSocialID, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                        if (!obraSocialID) {
                                            setValue('obraSocial.numeroAfiliado', '', {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                        }
                                    }}
                                >
                                    <option value="">NINGUNA</option>
                                    {obrasSocialesData?.map((obraSocial) => (
                                        <option
                                            key={obtenerIdObraSocial(obraSocial)}
                                            value={obtenerIdObraSocial(obraSocial)}
                                        >
                                            {obraSocial.nombreObraSocial}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                            <div className={styles.grupoCampo}>
                                <small className={styles.ayudaCampo}>
                                    Número de afiliado que figura en la credencial.
                                </small>
                                <Form.Control
                                    className={styles.campoInput}
                                    placeholder="Número de Afiliado"
                                    disabled={!watch('obraSocial.obraSocialID')}
                                    {...register('obraSocial.numeroAfiliado')}
                                    isInvalid={!!errors.obraSocial?.numeroAfiliado}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.obraSocial?.numeroAfiliado?.message}
                                </Form.Control.Feedback>
                            </div>
                        </div>
                    </fieldset>

                    {obraSocialNoEncontrada && (
                        <Alert variant="warning">
                            No se pudo asociar la obra social actual. Seleccioná la obra social correcta antes de actualizar.
                        </Alert>
                    )}

                    <div className="d-flex justify-content-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting || cargandoObrasSociales || !obrasSocialesData || obraSocialNoEncontrada}
                        >
                            {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    );
};

export default EditarPaciente;
