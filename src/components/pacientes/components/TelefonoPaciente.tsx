import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO} from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
}

const TelefonoPaciente = ({ register, errores, styles }:Props)=> (

<fieldset>
    <legend> Telefono </legend>
        <div className={styles.filaInput} >
            
            <select
                id="opciones"
                className={styles.campoInput}
                {...register ('telefono.tipo')}
            >   
                {/*<option value="" disabled hidden> TIPO </option>*/}
                <option value="CELULAR">Celular</option>
                <option value="FIJO">Fijo</option>
                
            </select>
            <input
                type="text"
                className={styles.campoInput}
                placeholder="54"
                {...register ('telefono.codigoPais')}
            />
            {errores.telefono?.codigoPais && <span className={styles.error}>{errores.telefono.codigoPais.message}</span>}
            <input
                type="text"
                className={styles.campoInput}
                placeholder="Código de Área"
                {...register ('telefono.codigoArea')}
            />
            {errores.telefono?.codigoArea && <span className={styles.error}>{errores.telefono.codigoArea.message}</span>}
            <input
                type="text"
                className={styles.campoInput}
                placeholder="Teléfono"
                {...register ('telefono.numero')}
            />
            {errores.telefono?.numero && <span className={styles.error}>{errores.telefono.numero.message}</span>}
        </div>
    </fieldset>

);

export default TelefonoPaciente;