import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO} from '../../../types/Paciente.type';

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
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Nombre y apellido tal como figura en el DNI.</small>
            <input
                type="text"
                className={styles.campoInput} 	placeholder="Nombre Completo"
                {...register('nombre')}
            />
            {errores.nombre && <span className={styles.error}>{errores.nombre.message}</span>}
        </div>
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Número de documento sin puntos.</small>
            <input
                type="text" 
                className={styles.campoInput} 	placeholder="DNI"
                {...register('dni')}
            />
            {errores.dni && <span className={styles.error}>{errores.dni.message}</span>}
        </div>
        <div className={styles.filaInput} >
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Indica la fecha de nacimiento.</small>
                <input
                    type="date" 
                    className={styles.campoInput} 	placeholder="Fecha de Nacimiento"
                    {...register ('fechaDeNacimiento')}
                />
                {errores.fechaDeNacimiento && <span className={styles.error}>{errores.fechaDeNacimiento.message}</span>}
            </div>
        </div>
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Correo electrónico de contacto (opcional).</small>
            <input
                type="email" 
                className={styles.campoInput} 	placeholder="E-mail"
                {...register ('email')}
            />
            {errores.email && <span className={styles.error}>{errores.email.message}</span>}
        </div>
    </fieldset>
);
export default DatosPersonales;
