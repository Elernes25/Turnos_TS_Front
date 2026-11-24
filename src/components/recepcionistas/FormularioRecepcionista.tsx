import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import styles from '../medicos/FormularioMedico.module.scss';
import DatosPersonalesRecepcionista from './components/DatosPersonalesRecepcionista';
import DireccionRecepcionista from './components/DireccionRecepcionista';
import ModalSeguirCargando from './components/ModalSeguirCargando';
import TelefonoRecepcionista from './components/TelefonoRecepcionista';
import { clientesAxios } from '../../config/axios';
import {
    crearRecepcionistaSchema,
    type ICrearRecepcionistaDTO,
    type ICrearRecepcionistaRequest,
} from '../../types/Recepcionista.type';
import { TipoTelefono } from '../../types/Medico.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

interface FormularioRecepcionistaProps {
    recepcionistaId?: string;
    valoresIniciales?: ICrearRecepcionistaDTO;
}

const obtenerValoresIniciales = (): ICrearRecepcionistaDTO => ({
    nombre: '',
    dni: '',
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
    usuario: {
        password: '',
    },
});

const FormularioRecepcionista = ({
    recepcionistaId,
    valoresIniciales,
}: FormularioRecepcionistaProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const esEdicion = recepcionistaId !== undefined;
    const [mostrarModalSeguimiento, setMostrarModalSeguimiento] = useState(false);
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const formularioRef = useRef<HTMLFormElement | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ICrearRecepcionistaDTO>({
        resolver: zodResolver(crearRecepcionistaSchema),
        defaultValues: valoresIniciales ?? obtenerValoresIniciales(),
    });
    const registroEmail = register('email');

    const seguirCargando = (): void => {
        setMostrarModalSeguimiento(false);
    };

    const alCerrarModalSeguimiento = (): void => {
        formularioRef.current?.reset();
        reset(obtenerValoresIniciales());
        window.requestAnimationFrame(() => emailInputRef.current?.focus());
    };

    const onSubmit = async (datosValidados: ICrearRecepcionistaDTO): Promise<void> => {
        const { usuario, ...datosRecepcionista } = datosValidados;
        if (esEdicion) {
            try {
                await clientesAxios.put(`/recepcionistas/${recepcionistaId}`, datosRecepcionista);
                toast.success('Recepcionista actualizado correctamente');
                navigate('/recepcionistas');
            } catch (error: unknown) {
                toast.error(obtenerMensajeError(error));
            }
            return;
        }

        const password = usuario?.password;

        if (!password) {
            setError('usuario.password', {
                type: 'required',
                message: 'La contraseña es obligatoria',
            });
            return;
        }

        const user = datosRecepcionista.email.split('@')[0];
        if (user.length < 4) {
            setError('email', {
                type: 'validate',
                message: 'El e-mail debe tener al menos 4 caracteres antes de @ para definir el usuario.',
            });
            return;
        }

        const payload: ICrearRecepcionistaRequest = {
            ...datosRecepcionista,
            usuario: { user, password },
        };

        try {
            await clientesAxios.post('/recepcionistas', payload);
            setMostrarModalSeguimiento(true);
        } catch (error: unknown) {
            toast.error(obtenerMensajeError(error));
        }
    };

    const volver = (): void => {
        const origen = location.state?.from;
        if (typeof origen === 'string') {
            navigate(origen);
        } else if (esEdicion) {
            navigate('/recepcionistas');
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={styles.contenedorFormulario}>
            <h3>{esEdicion ? 'Editar Recepcionista' : 'Ingreso de Nuevo Recepcionista'}</h3>
            <form ref={formularioRef} onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset>
                    <legend>Datos de Acceso al sistema</legend>
                    <div className={styles.filaInput}>
                        <div className={styles.grupoCampo}>
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...registroEmail}
                                ref={(elemento) => {
                                    registroEmail.ref(elemento);
                                    emailInputRef.current = elemento;
                                }}
                                className={styles.campoInput}
                                placeholder="usuario@correo.com"
                            />
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                        </div>
                        {!esEdicion && (
                            <div className={styles.grupoCampo}>
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('usuario.password')}
                                    className={styles.campoInput}
                                    placeholder="Contraseña"
                                />
                                {errors.usuario?.password && (
                                    <span className={styles.error}>{errors.usuario.password.message}</span>
                                )}
                            </div>
                        )}
                    </div>
                </fieldset>

                <DatosPersonalesRecepcionista register={register} errores={errors} />
                <DireccionRecepcionista register={register} errores={errors} />
                <TelefonoRecepcionista register={register} errores={errors} />

                <div className="d-flex gap-3">
                    <Button type="button" onClick={volver}>
                        Volver
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Guardar'}
                    </Button>
                </div>
            </form>
            {!esEdicion && (
                <ModalSeguirCargando
                    mostrar={mostrarModalSeguimiento}
                    onIrARecepcionistas={() => navigate('/recepcionistas')}
                    onSeguirCargando={seguirCargando}
                    onExited={alCerrarModalSeguimiento}
                />
            )}
        </div>
    );
};

export default FormularioRecepcionista;