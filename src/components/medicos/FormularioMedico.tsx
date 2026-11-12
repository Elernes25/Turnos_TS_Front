import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from 'react-bootstrap';
import styles from './FormularioMedico.module.scss';
import { JsonDebugger } from '../utils/JsonDebugger';
import { crearMedicoSchema } from '../../types/Medico.type';
import type { IcrearMedicoDTO } from '../../types/Medico.type';
import DatosPersonales from './components/DatosPersonales';
import DireccionMedico from './components/DireccionMedico';
import TelefonoMedico from './components/TelefonoMedico';
import { clientesAxios } from '../../config/axios';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';

interface FormularioMedicoProps {
    medicoId?: string;                    // presente = modo edición
    valoresIniciales?: IcrearMedicoDTO;   // datos cargados del médico
}


const FormularioMedico = ({ medicoId, valoresIniciales }: FormularioMedicoProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const esEdicion = medicoId !== undefined;

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
        useForm<IcrearMedicoDTO>({
        resolver: zodResolver(crearMedicoSchema),
        defaultValues: valoresIniciales ?? {
            telefono: { codigoPais: '54', codigoArea: '3777' },
        },
        });

    const onSubmit = async (datosValidados: IcrearMedicoDTO): Promise<void> => {
        try {
        if (esEdicion) {
            await clientesAxios.put(`/medicos/${medicoId}/editar`, datosValidados);
        } else {
            await clientesAxios.post('/medicos', datosValidados);
        }
        toast.success(esEdicion ? 'Médico actualizado' : 'Médico guardado');
        navigate('/medicos');
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
            <DatosPersonales register={register} control={control} errores={errors} styles={styles} />
            <DireccionMedico register={register} errores={errors} styles={styles} />
            <TelefonoMedico register={register} errores={errors} styles={styles} />
            <div className="d-flex gap-3">
                <Button onClick={volver}>
                    Volver
                </Button>
                
                <Button type="submit" disabled={isSubmitting}>
                    {esEdicion ? 'Guardar cambios' : 'Guardar Médico'}
                </Button>
            </div>

        </form>
        <JsonDebugger control={control} titulo="ESTADO DEL JSON" />
        </div>
    );
};

export default FormularioMedico;