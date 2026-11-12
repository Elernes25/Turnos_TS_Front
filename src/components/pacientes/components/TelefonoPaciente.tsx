import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO} from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
}

const TelefonoPaciente = ({ register, errores, styles }:Props)=> (

<fieldset>
    <legend> Teléfono </legend>
        <div className={styles.filaInput} >
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Indica si es celular o fijo.</small>
                <select
                    id="opciones"
                    className={styles.campoInput}
                    {...register ('telefono.tipo')}
                >   
                    <option value="CELULAR">Celular</option>
                    <option value="FIJO">Fijo</option>
                </select>
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Código de País (Argentina: 54).</small>
                <input
                    type="text"
                    className={styles.campoInput}
                    placeholder="54"
                    {...register ('telefono.codigoPais')}
                />
                {errores.telefono?.codigoPais && <span className={styles.error}>{errores.telefono.codigoPais.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Código de área, sin el 0 inicial.</small>
                <input
                    type="text"
                    className={styles.campoInput}
                    placeholder="3777"
                    {...register ('telefono.codigoArea')}
                />
                {errores.telefono?.codigoArea && <span className={styles.error}>{errores.telefono.codigoArea.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Número de teléfono.</small>
                <input
                    type="text"
                    className={styles.campoInput}
                    placeholder="Teléfono"
                    {...register ('telefono.numero')}
                />
                {errores.telefono?.numero && <span className={styles.error}>{errores.telefono.numero.message}</span>}
            </div>
        </div>
    </fieldset>

);

export default TelefonoPaciente;