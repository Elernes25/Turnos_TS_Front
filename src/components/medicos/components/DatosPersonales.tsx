import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearMedicoDTO} from '../../../types/Medico.type';
import {SelectEspecialidad} from '../../../components/especialidad/SelectEspecialidad';


interface Props {
    register: UseFormRegister<IcrearMedicoDTO>;
    errores: FieldErrors<IcrearMedicoDTO>;
    styles: any;
}

const DatosPersonales = ({ register, errores, styles }:Props) => (
    <fieldset>
        <legend> Datos Personales </legend>
        <input
            type="text"
            {...register("nombre")}
            className={styles.campoInput} 	placeholder="Nombre Completo"
        />
        {errores.nombre && <span className={styles.error}>{errores.nombre.message}</span>}
        <input
            type="text" 
            {...register("dni")}
            className={styles.campoInput} 	placeholder="DNI"
        />
        {errores.dni && <span className={styles.error}>{errores.dni.message}</span>}
        
        <input
            type="email"
            {...register("email")}
            className={styles.campoInput} 	placeholder="E-mail"
        />
        {errores.email && <span className={styles.error}>{errores.email.message}</span>}
     {/*   <input
            type="text" name="especialidad" value={esp}
            className={styles.campoInput} 	placeholder="Especialidad"
            onChange={onChange}
        />
        
     */}
        <SelectEspecialidad register={register} styles={styles} />
        {errores.especialidad && <span className={styles.error}>{errores.especialidad.message}</span>}

    {/*    <select
            {...register("especialidad")}
            className={styles.campoInput}
        >
        <option value="" disabled>Seleccione especialidad</option>
            {especialidad.map(esp => (
                <option key={esp.id} value={esp.id}>
                    {esp.especialidad}
                </option>
            ))}
        </select>
    */}   
        <input
            type="text" 
            {...register("matriculaNumero")}
            className={styles.campoInput} 	
            placeholder="Numero de Matricula"
        />
    </fieldset>
);
export default DatosPersonales;
