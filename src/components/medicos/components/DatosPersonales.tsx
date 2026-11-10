import {UseFormRegister,FieldErrors,Control } from 'react-hook-form';
import {IcrearMedicoDTO} from '../../../types/Medico.type';
import { SelectEspecialidad } from '../../especialidad/SelectEspecialidad';

interface Props {
    register: UseFormRegister<IcrearMedicoDTO>;
    control: Control<IcrearMedicoDTO>;
    errores: FieldErrors<IcrearMedicoDTO>;
    styles: any;
}

const DatosPersonales = ({ register, control, errores, styles }: Props) => (
    <fieldset>
        <legend> Datos Personales </legend>
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Nombre y apellido tal como figura en el DNI.</small>
            <input
                type="text"
                {...register("nombre")}
                className={styles.campoInput} 	placeholder="Nombre Completo"
            />
            {errores.nombre && <span className={styles.error}>{errores.nombre.message}</span>}
        </div>
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Número de documento sin puntos.</small>
            <input
                type="text" 
                {...register("dni")}
                className={styles.campoInput} 	placeholder="DNI"
            />
            {errores.dni && <span className={styles.error}>{errores.dni.message}</span>}
        </div>
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Correo electrónico de contacto profesional.</small>
            <input
                type="email"
                {...register("email")}
                className={styles.campoInput} 	placeholder="E-mail"
            />
            {errores.email && <span className={styles.error}>{errores.email.message}</span>}
        </div>
     {/*   <input
            type="text" name="especialidad" value={esp}
            className={styles.campoInput} 	placeholder="Especialidad"
            onChange={onChange}
        />
        
     */}
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Selecciona la especialidad del médico.</small>
         <SelectEspecialidad control={control} styles={styles} />
            {errores.especialidad && (<span className={styles.error}>{errores.especialidad.message}</span>)}
        </div>
   
        <div className={styles.grupoCampo}>
            <small className={styles.ayudaCampo}>Número de matrícula profesional.</small>
            <input
                type="text" 
                {...register("numeroMatricula")}
                className={styles.campoInput} 	
                placeholder="Numero de Matricula"
            />
        </div>
    </fieldset>
);
export default DatosPersonales;
