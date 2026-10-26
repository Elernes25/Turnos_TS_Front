import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './FormularioMedico.module.scss';
import {JsonDebugger} from '../utils/JsonDebugger';
import {Button} from 'react-bootstrap';
import { crearMedicoSchema } from '../../types/Medico.type';  //importa el esquema de validacion de datos
import type {IcrearMedicoDTO} from '../../types/Medico.type' //tipo de datos para el formulario de Medico
import DatosPersonales from './components/DatosPersonales';
import DireccionMedico from './components/DireccionMedico';
import TelefonoMedico from './components/TelefonoMedico';
import axios from 'axios';
import {clientesAxios} from '../../config/axios'

const FormularioMedico = () => {
    const { register, handleSubmit, watch, formState: {errors}} 
            = useForm<IcrearMedicoDTO>({ resolver:zodResolver(crearMedicoSchema) });
    
    const onSubmit = async (datosValidados: IcrearMedicoDTO) => {
        try {
            await clientesAxios.post('/medicos', datosValidados);
            alert("Médico guardado en base de datos");
        }catch (error:any) {
            const mensaje = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Error del servidor"
                : "el servidor esta apagado o no responde";
            alert(mensaje); /*hacer con sonner toast */
        };
        console.log(datosValidados);
    };

    return (
        <div className={styles.contenedorFormulario}>
            <h3>Ingreso de Nuevo Médico</h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                {/* ---datos personales --- */}
                 <DatosPersonales
                    register={register}
                    errores={errors}
                    styles={styles}
                />
                <DireccionMedico
                    register={register}
                    errores={errors}
                    styles={styles}
                />
               <TelefonoMedico
                    register={register}
                    errores={errors}
                    styles={styles}
                />
              
              <Button type="submit"> Guardar Médico </Button>
            </form>
            <JsonDebugger watch={watch} titulo="ESTADO DEL JSON" />
        </div>
    );
};

export default FormularioMedico;