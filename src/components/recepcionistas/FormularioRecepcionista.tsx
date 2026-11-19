import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import styles from '../medicos/FormularioMedico.module.scss';
import { clientesAxios } from '../../config/axios';
import {
    crearRecepcionistaSchema,
    type ICrearRecepcionistaDTO,
    type ICrearRecepcionistaRequest,
} from '../../types/Recepcionista.type';
import { TipoTelefono } from '../../types/Medico.type';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

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

const FormularioRecepcionista = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ICrearRecepcionistaDTO>({
        resolver: zodResolver(crearRecepcionistaSchema),
        defaultValues: obtenerValoresIniciales(),
    });

    const onSubmit = async (datosValidados: ICrearRecepcionistaDTO): Promise<void> => {
        const { usuario, ...datosRecepcionista } = datosValidados;
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
            toast.success('Recepcionista creada exitosamente');
            reset(obtenerValoresIniciales());
        } catch (error: unknown) {
            toast.error(obtenerMensajeError(error));
        }
    };

    const volver = (): void => {
        const origen = location.state?.from;
        if (typeof origen === 'string') {
            navigate(origen);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={styles.contenedorFormulario}>
            <h3>Ingreso de Nueva Recepcionista</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset>
                    <legend>Datos de Acceso al sistema</legend>
                    <div className={styles.filaInput}>
                        <div className={styles.grupoCampo}>
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email')}
                                className={styles.campoInput}
                                placeholder="usuario@correo.com"
                            />
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                        </div>
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
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Datos Personales</legend>
                    <div className={styles.filaInput}>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Nombre y apellido tal como figura en el DNI.</small>
                            <input
                                type="text"
                                {...register('nombre')}
                                className={styles.campoInput}
                                placeholder="Nombre Completo"
                            />
                            {errors.nombre && <span className={styles.error}>{errors.nombre.message}</span>}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Número de documento sin puntos.</small>
                            <input
                                type="text"
                                {...register('dni')}
                                className={styles.campoInput}
                                placeholder="DNI"
                            />
                            {errors.dni && <span className={styles.error}>{errors.dni.message}</span>}
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Dirección</legend>
                    <div className={styles.filaInput}>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Nombre de la calle.</small>
                            <input
                                type="text"
                                {...register('direccion.calle')}
                                className={styles.campoInput}
                                placeholder="Calle"
                            />
                            {errors.direccion?.calle && (
                                <span className={styles.error}>{errors.direccion.calle.message}</span>
                            )}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Altura de la calle.</small>
                            <input
                                type="text"
                                {...register('direccion.numero')}
                                className={styles.campoInput}
                                placeholder="Número"
                            />
                            {errors.direccion?.numero && (
                                <span className={styles.error}>{errors.direccion.numero.message}</span>
                            )}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Piso si corresponde.</small>
                            <input
                                type="text"
                                {...register('direccion.piso')}
                                className={styles.campoInput}
                                placeholder="Piso"
                            />
                            {errors.direccion?.piso && (
                                <span className={styles.error}>{errors.direccion.piso.message}</span>
                            )}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Departamento si corresponde.</small>
                            <input
                                type="text"
                                {...register('direccion.departamento')}
                                className={styles.campoInput}
                                placeholder="Departamento"
                            />
                            {errors.direccion?.departamento && (
                                <span className={styles.error}>{errors.direccion.departamento.message}</span>
                            )}
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Teléfono</legend>
                    <div className={styles.filaInput}>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Indica si es celular o fijo.</small>
                            <select
                                {...register('telefono.tipo')}
                                className={styles.campoInput}
                            >
                                <option value={TipoTelefono.CELULAR}>Celular</option>
                                <option value={TipoTelefono.FIJO}>Fijo</option>
                            </select>
                            {errors.telefono?.tipo && (
                                <span className={styles.error}>{errors.telefono.tipo.message}</span>
                            )}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Código de país (Argentina: 54).</small>
                            <input
                                type="text"
                                {...register('telefono.codigoPais')}
                                className={styles.campoInput}
                                placeholder="54"
                            />
                            {errors.telefono?.codigoPais && (
                                <span className={styles.error}>{errors.telefono.codigoPais.message}</span>
                            )}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Código de área sin el 0.</small>
                            <input
                                type="text"
                                {...register('telefono.codigoArea')}
                                className={styles.campoInput}
                                placeholder="3777"
                            />
                            {errors.telefono?.codigoArea && (
                                <span className={styles.error}>{errors.telefono.codigoArea.message}</span>
                            )}
                        </div>
                        <div className={styles.grupoCampo}>
                            <small className={styles.ayudaCampo}>Número de teléfono.</small>
                            <input
                                type="text"
                                {...register('telefono.numero')}
                                className={styles.campoInput}
                                placeholder="Teléfono"
                            />
                            {errors.telefono?.numero && (
                                <span className={styles.error}>{errors.telefono.numero.message}</span>
                            )}
                        </div>
                    </div>
                </fieldset>

                <div className="d-flex gap-3">
                    <Button type="button" onClick={volver}>
                        Volver
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormularioRecepcionista;