import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import styles from './FormularioMedico.module.scss';
//import { JsonDebugger } from '../utils/JsonDebugger';
import { crearMedicoSchema, type ICrearMedicoRequest } from '../../types/Medico.type';
import type { IcrearMedicoDTO } from '../../types/Medico.type';
import DatosPersonales from './components/DatosPersonales';
import DatosProfesionales from './components/DatosProfesionales';
import DireccionMedico from './components/DireccionMedico';
import TelefonoMedico from './components/TelefonoMedico';
import ModalCargarAgenda from './components/ModalCargarAgenda';
import { clientesAxios } from '../../config/axios';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

interface FormularioMedicoProps {
    medicoId?: string;                    // presente = modo edición
    valoresIniciales?: IcrearMedicoDTO;   // datos cargados del médico
}

interface IRespuestaCrearMedico {
    datos?: {
        id?: string;
        _id?: string;
    };
}

const FormularioMedico = ({ medicoId, valoresIniciales }: FormularioMedicoProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const esEdicion = medicoId !== undefined;
    const [medicoCreadoId, setMedicoCreadoId] = useState<string | null>(null);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const { register, handleSubmit, control, setError, formState: { errors, isSubmitting } } =
        useForm<IcrearMedicoDTO>({
        resolver: zodResolver(crearMedicoSchema),
        defaultValues: valoresIniciales ?? {
            telefono: { codigoPais: '54', codigoArea: '3777' },
            usuario: { password: '' },
        },
        });

    const onSubmit = async (datosValidados: IcrearMedicoDTO): Promise<void> => {
        try {
        const { usuario, ...datosMedico } = datosValidados;
        if (esEdicion) {
            await clientesAxios.put(`/medicos/${medicoId}/editar`, datosMedico);
            toast.success('Médico actualizado');
            navigate('/medicos');
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

        const user = datosMedico.email.split('@')[0];
        if (user.length < 4) {
            setError('email', {
                type: 'validate',
                message: 'El e-mail debe tener al menos 4 caracteres antes de @ para definir el usuario.',
            });
            return;
        }

        const payload: ICrearMedicoRequest = {
            ...datosMedico,
            usuario: { user, password },
        };
        const respuesta = await clientesAxios.post<IRespuestaCrearMedico>('/medicos', payload);
        const idCreado = respuesta.data.datos?.id ?? respuesta.data.datos?._id;

        if (!idCreado) {
            toast.error('El médico se creó, pero el servidor no devolvió su identificador.');
            return;
        }

        setMedicoCreadoId(idCreado);
        } catch (error: unknown) {
        toast.error(obtenerMensajeError(error));
        }
    };

    const volver = () => { 
        if (location.state?.from) { 
            navigate(location.state.from);
        } else {
            navigate('/medicos');
        }
    };

    return (
        <div className={styles.contenedorFormulario}>
        <h3>{esEdicion ? 'Editar Médico' : 'Ingreso de Nuevo Médico'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    {!esEdicion && (
                        <div className={styles.grupoCampo}>
                            <label htmlFor="password">Contraseña</label>
                            <div className={styles.campoPassword}>
                                <input
                                    id="password"
                                    type={mostrarPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    {...register('usuario.password')}
                                    className={styles.campoInput}
                                    placeholder="Contraseña"
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    className={styles.togglePassword}
                                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    aria-pressed={mostrarPassword}
                                    onClick={() => setMostrarPassword((visible) => !visible)}
                                >
                                    {mostrarPassword ? <EyeSlash aria-hidden="true" /> : <Eye aria-hidden="true" />}
                                </Button>
                            </div>
                            {errors.usuario?.password && (
                                <span className={styles.error}>{errors.usuario.password.message}</span>
                            )}
                        </div>
                    )}
                </div>
            </fieldset>
            <DatosPersonales register={register} errores={errors} styles={styles} />
            <DireccionMedico register={register} errores={errors} styles={styles} />
            <TelefonoMedico register={register} errores={errors} styles={styles} />
            <DatosProfesionales register={register} control={control} errores={errors} styles={styles} />
            <div className="d-flex gap-3">
                <Button type="button" onClick={volver}>
                    Volver
                </Button>
                
                <Button type="submit" disabled={isSubmitting}>
                    {esEdicion ? 'Guardar cambios' : 'Guardar Médico'}
                </Button>
            </div>

        </form>
        {medicoCreadoId && (
            <ModalCargarAgenda
                medicoId={medicoCreadoId}
                onVolver={volver}
            />
        )}
        {/*<JsonDebugger control={control} titulo="ESTADO DEL JSON" />*/}
        </div>
    );
};

export default FormularioMedico;