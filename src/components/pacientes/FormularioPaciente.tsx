/*useForm Es un custom hook que provee toda la lógica para manejar formularios en React:
 registro de inputs, validación, envío, errores, et */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './FormularioPaciente.module.scss';
import {JsonDebugger} from '../utils/JsonDebugger';
import {Button} from 'react-bootstrap';
//import {UseFormRegister,FieldErrors} from 'react-hook-form';
import { crearPacienteSchema, TipoSexo } from '../../types/Paciente.type';  //importa el esquema de validacion de datos
import type {IcrearPacienteDTO} from '../../types/Paciente.type' //tipo de datos para el formulario de paciente

import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
//import HistorialMedicoPaciente from './components/HistorialMedicoPaciente';
import ObraSocialPaciente from './components/ObraSocialPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import axios from 'axios';
import {clientesAxios} from '../../config/axios'

/*React (y ESLint) espera que los componentes se nombren con PascalCase
(primera letra mayúscula). Si usas minúscula (formularioPaciente), 
ESLint lo interpreta como una función normal y no como un componente válido,
por eso te subraya useState. */
/*
interface Props {
    register: UseFormRegister<IcrearPacienteInput>;
    error: FieldErrors<IcrearPacienteInput>;
    styles: any;
}
*/
const FormularioPaciente = () => {
    /*
    zodResolver es una función que viene del paquete @hookform/resolvers/zod.
    Su trabajo es adaptar un esquema de Zod para que React Hook Form
    lo use como validador de los datos del formulario.
    Básicamente: convierte el resultado de schema.parse() o schema.safeParse()
    en el formato de errores que React Hook Form espera (formState.errors).
     */

    const { register, handleSubmit, watch, formState: { errors }} 
            = useForm<IcrearPacienteDTO>({ resolver: zodResolver(crearPacienteSchema), defaultValues: {
            sexo: TipoSexo.FEMENINO} });
 
 /*
 const { register, handleSubmit, watch, formState: { errors }} 
            = useForm<IcrearPacienteDTO>({ resolver: zodResolver(crearPacienteSchema) });
 
 */
    const onSubmit = async (datosValidados: IcrearPacienteDTO) => {
        try {
            await clientesAxios.post('/pacientes', datosValidados);
            alert("Paciente guardado en base de datos");
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
            <h3>Ingreso de Nuevo Paciente</h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                {/* ---datos personales --- */}
                 <DatosPersonales
                    register={register}
                    errores={errors}
                    styles={styles}
                />
                <DireccionPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />
               <TelefonoPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />
               <ObraSocialPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />
              <Button type="submit"> Guardar Paciente </Button>
            
{/*todos los fieldset podrian ser un componente de React diferente */}
{/*YA SON UN COMPONENTE DIFERENTE */}
            </form>
            <JsonDebugger watch={watch} titulo="ESTADO DEL JSON" />
        </div>
    );
};

export default FormularioPaciente;