import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO , TipoSexo} from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
}

/*
const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};
*/
const DatosPersonales =({register, errores, styles}:Props) => (
//const DatosPersonales = ({ paciente, errores, onChange, styles }) => (
    <fieldset>
        <legend>  Datos Personales </legend>
        <input
            type="text"
            className={styles.campoInput} 	placeholder="Nombre Completo"
            {...register('nombre')}
            /*se va name=... , value=..., onChange(...) */
        />
        {/*renderizado condicional */}
        {errores.nombre && <span className={styles.error}>{errores.nombre.message}</span>}
        <input
            type="text" 
            className={styles.campoInput} 	placeholder="DNI"
            {...register('dni')}
        />
        {errores.dni && <span className={styles.error}>{errores.dni.message}</span>}
        <div className={styles.filaInput} >
                <input
                    type="date" 
                    className={styles.campoInput} 	placeholder="Fecha de Nacimiento"
                    {...register ('fechaDeNacimiento')}
                />
            
                <label>
                    <input
                        type="radio"
                        className={styles.campoInput} 
                        value={TipoSexo.FEMENINO}
                        {...register('sexo')}
                        />
                        Femenino
                </label>
                <label>
                    <input
                        type="radio"
                        className={styles.campoInput} 
                        value={TipoSexo.MASCULINO}
                        {...register('sexo')}
                    />
                    Masculino
                </label>
                {errores.sexo && <span className={styles.error}>{errores.sexo.message}</span>}
        </div>
        <input
            type="email" 
            className={styles.campoInput} 	placeholder="E-mail"
            {...register ('email')}
        />
        {errores.email && <span className={styles.error}>{errores.email.message}</span>}
    </fieldset>
);
export default DatosPersonales;
