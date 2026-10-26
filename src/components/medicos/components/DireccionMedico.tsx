import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearMedicoDTO} from '../../../types/Medico.type';

interface Props {
    register: UseFormRegister<IcrearMedicoDTO>;
    errores: FieldErrors<IcrearMedicoDTO>;
    styles: any;
}

const DireccionMedico = ({ register, errores, styles }:Props) =>  (
    <fieldset>
        <legend> Dirección </legend>
        <div className={styles.filaInput} >
        <input
            type="text"
            {...register("direccion.calle")}
            className={styles.campoInput}   
            placeholder="Calle"
        />
        {errores.direccion?.calle && <span className={styles.error}>{errores.direccion.calle.message}</span>}
        <input
            type="text"
            {...register("direccion.numero")}
            className={styles.campoInput}
            placeholder="Número"
            />
        {errores.direccion?.numero && <span className={styles.error}>{errores.direccion.numero.message}</span>}
        <input
            type="text"
            {...register("direccion.piso") }   
            className={styles.campoInput}
            placeholder="Piso"
        />
        {errores.direccion?.piso && <span className={styles.error}>{errores.direccion.piso.message}</span>}
        <input
            type="text"
            {...register("direccion.departamento")}
            className={styles.campoInput}
            placeholder="Departamento"
        />
        {errores.direccion?.departamento && <span className={styles.error}>{errores.direccion.departamento.message}</span>}
        <input
            type="text"
            {...register("direccion.barrio")}
            className={styles.campoInput}
            placeholder="Barrio"
        />
        {errores.direccion?.barrio && <span className={styles.error}>{errores.direccion.barrio.message}</span>}
        </div>
    </fieldset>

);

export default DireccionMedico;