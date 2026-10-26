import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO} from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
}

const DireccionPaciente = ({ register, errores, styles }:Props) =>  (
    <fieldset>
        <legend> Direccion </legend>
        <div className={styles.filaInput} >
        <input
            type="text"
            className={styles.campoInput}   
            placeholder="Calle"
            {...register('direccion.calle')}
        />
        {errores.direccion?.calle && <span className={styles.error}>{errores.direccion.calle.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Número"
            {...register('direccion.numero')}
        />
        {errores.direccion?.numero && <span className={styles.error}>{errores.direccion.numero.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Piso"
            {...register('direccion.piso')}
        />
        {errores.direccion?.piso && <span className={styles.error}>{errores.direccion.piso.message}</span>}
        <input
            type="text" 
            className={styles.campoInput}
            placeholder="Departamento"
            {...register('direccion.departamento')}
        />
        {errores.direccion?.departamento && <span className={styles.error}>{errores.direccion.departamento.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Barrio"
           {...register('direccion.barrio')}
        />
        {errores.direccion?.barrio && <span className={styles.error}>{errores.direccion.barrio.message}</span>}
        </div>
    </fieldset>

);

export default DireccionPaciente;