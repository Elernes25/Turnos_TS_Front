/*useForm Es un custom hook que provee toda la lógica para manejar formularios en React:
 registro de inputs, validación, envío, errores, et */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './FormularioPaciente.module.scss';
import {JsonDebugger} from '../utils/JsonDebugger';
import {Button} from 'react-bootstrap';
//import {UseFormRegister,FieldErrors} from 'react-hook-form';
import { crearPacienteSchema, TipoSexo, TipoTelefono } from '../../types/Paciente.type';  //importa el esquema de validacion de datos

import type {IcrearPacienteDTO} from '../../types/Paciente.type' //tipo de datos para el formulario de paciente

import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
import ObraSocialPaciente from './../obraSocial/ObraSocialPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import axios from 'axios';
import {clientesAxios} from '../../config/axios';
import { toast } from 'sonner';

/*React (y ESLint) espera que los componentes se nombren con PascalCase
(primera letra mayúscula). Si usas minúscula (formularioPaciente), 
ESLint lo interpreta como una función normal y no como un componente válido,
por eso te subraya useState. */

const FormularioPaciente = () => {
    /*
    zodResolver es una función que viene del paquete @hookform/resolvers/zod.
    Su trabajo es adaptar un esquema de Zod para que React Hook Form
    lo use como validador de los datos del formulario.
    Básicamente: convierte el resultado de schema.parse() o schema.safeParse()
    en el formato de errores que React Hook Form espera (formState.errors).
     */

    const { register, handleSubmit, setValue, control, reset, formState: { errors, isSubmitting  }} 
            = useForm<IcrearPacienteDTO>({ resolver: zodResolver(crearPacienteSchema), 
                mode: "onChange",            // valida mientras se escribe
                reValidateMode: "onChange", //revalida mientras se escribe tras un submit fallido
                defaultValues: {
                    nombre: "",
                    dni: "",
                    fechaDeNacimiento: "",
                    sexo: TipoSexo.FEMENINO,
                    email: "",
                    direccion: {
                        calle: "",
                        numero: "",
                        piso: "",
                        departamento: "",
                        barrio: "",
                    },
                    telefono: {
                        tipo: TipoTelefono.CELULAR,
                        codigoPais: "54",
                        codigoArea: "3777",
                        numero: "",
                    },
                    obraSocial: {
                        obraSocialID: "",
                        numeroAfiliado: ""
                    },
                }
            });
 
    const onSubmit = async (datosValidados: IcrearPacienteDTO) => {
        try {
            await clientesAxios.post('/pacientes', datosValidados);
            //alert("Paciente guardado en base de datos");
             toast.success("Paciente guardado correctamente");
             reset(); // vuelve a los defaultValues de useForm
        }catch (error:any) {
            const mensaje = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Error del servidor"
                : "el servidor esta apagado o no responde";
            toast.error(mensaje);
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
                    control={control}
                    register={register}
                    errores={errors}
                    styles={styles}
                    setValue={setValue}
                />

              <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Guardar Paciente"}
               </Button>

            </form>
            <JsonDebugger control={control} titulo="ESTADO DEL JSON" />
        </div>
    );
};

export default FormularioPaciente;