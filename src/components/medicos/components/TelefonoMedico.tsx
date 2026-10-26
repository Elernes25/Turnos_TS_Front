import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearMedicoDTO} from '../../../types/Medico.type';

interface Props {
    register: UseFormRegister<IcrearMedicoDTO>;
    errores: FieldErrors<IcrearMedicoDTO>;
    styles: any;
}

const TelefonoMedico = ({ register, errores, styles }:Props)=> ( 
<fieldset>
    <legend> Telefono </legend>
        <div className={styles.filaInput} >
            <select
                id="opciones"
                {...register("telefono.tipo")}
                className={styles.campoInput}
            >   
                {/*<option value="" disabled hidden> TIPO </option>*/}
                <option value="CELULAR">Celular</option>
                <option value="FIJO">Fijo</option>
            </select>
            {/*tal vez no vaya errores porque debe elegirse un valor */}
            {errores.telefono?.tipo && <span className={styles.error}>{errores.telefono.tipo.message}</span>}
            <input
                type="text"
                {...register("telefono.codigoPais")}
                className={styles.campoInput}
                placeholder="54"
            />
            {errores.telefono?.codigoPais && <span className={styles.error}>{errores.telefono.codigoPais.message}</span>}
            <input
                type="text"
                {...register("telefono.codigoArea")}
                className={styles.campoInput}
                placeholder="Código de Área"
            />
            {errores.telefono?.codigoArea && <span className={styles.error}>{errores.telefono.codigoArea.message}</span>}
            <input
                type="text"
                {...register("telefono.numero")}
                className={styles.campoInput}
                placeholder="Teléfono"
            />
            {errores.telefono?.numero && <span className={styles.error}>{errores.telefono.numero.message}</span>}
        </div>
    </fieldset>
);

export default TelefonoMedico;