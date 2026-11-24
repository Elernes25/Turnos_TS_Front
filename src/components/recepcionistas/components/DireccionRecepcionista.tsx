import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ICrearRecepcionistaDTO } from '../../../types/Recepcionista.type';
import styles from '../../medicos/FormularioMedico.module.scss';

interface DireccionRecepcionistaProps {
    register: UseFormRegister<ICrearRecepcionistaDTO>;
    errores: FieldErrors<ICrearRecepcionistaDTO>;
}

const DireccionRecepcionista = ({
    register,
    errores,
}: DireccionRecepcionistaProps) => (
    <fieldset>
        <legend>Dirección</legend>
        <div className={styles.filaInput}>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Nombre de la calle.</small>
                <input
                    type="text"
                    {...register('direccion.calle')}
                    className={styles.campoInput}
                    placeholder="Calle"
                />
                {errores.direccion?.calle && (
                    <span className={styles.error}>{errores.direccion.calle.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Altura de la calle.</small>
                <input
                    type="text"
                    {...register('direccion.numero')}
                    className={styles.campoInput}
                    placeholder="Número"
                />
                {errores.direccion?.numero && (
                    <span className={styles.error}>{errores.direccion.numero.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Piso.</small>
                <input
                    type="text"
                    {...register('direccion.piso')}
                    className={styles.campoInput}
                    placeholder="Piso"
                />
                {errores.direccion?.piso && (
                    <span className={styles.error}>{errores.direccion.piso.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Departamento.</small>
                <input
                    type="text"
                    {...register('direccion.departamento')}
                    className={styles.campoInput}
                    placeholder="Departamento"
                />
                {errores.direccion?.departamento && (
                    <span className={styles.error}>{errores.direccion.departamento.message}</span>
                )}
            </div>
        </div>
    </fieldset>
);

export default DireccionRecepcionista;
