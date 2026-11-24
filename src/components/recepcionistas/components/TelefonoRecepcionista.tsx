import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ICrearRecepcionistaDTO } from '../../../types/Recepcionista.type';
import { TipoTelefono } from '../../../types/Medico.type';
import styles from '../../medicos/FormularioMedico.module.scss';

interface TelefonoRecepcionistaProps {
    register: UseFormRegister<ICrearRecepcionistaDTO>;
    errores: FieldErrors<ICrearRecepcionistaDTO>;
}

const TelefonoRecepcionista = ({
    register,
    errores,
}: TelefonoRecepcionistaProps) => (
    <fieldset>
        <legend>Teléfono</legend>
        <div className={styles.filaInput}>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Indica si es celular o fijo.</small>
                <select {...register('telefono.tipo')} className={styles.campoInput}>
                    <option value={TipoTelefono.CELULAR}>Celular</option>
                    <option value={TipoTelefono.FIJO}>Fijo</option>
                </select>
                {errores.telefono?.tipo && (
                    <span className={styles.error}>{errores.telefono.tipo.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Cód. de país (Arg.: 54).</small>
                <input
                    type="text"
                    {...register('telefono.codigoPais')}
                    className={styles.campoInput}
                    placeholder="54"
                />
                {errores.telefono?.codigoPais && (
                    <span className={styles.error}>{errores.telefono.codigoPais.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Cód. de área, sin el 0.</small>
                <input
                    type="text"
                    {...register('telefono.codigoArea')}
                    className={styles.campoInput}
                    placeholder="3777"
                />
                {errores.telefono?.codigoArea && (
                    <span className={styles.error}>{errores.telefono.codigoArea.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Número de teléfono.</small>
                <input
                    type="text"
                    {...register('telefono.numero')}
                    className={styles.campoInput}
                    placeholder="Teléfono"
                />
                {errores.telefono?.numero && (
                    <span className={styles.error}>{errores.telefono.numero.message}</span>
                )}
            </div>
        </div>
    </fieldset>
);

export default TelefonoRecepcionista;
