import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ICrearRecepcionistaDTO } from '../../../types/Recepcionista.type';
import styles from '../../medicos/FormularioMedico.module.scss';

interface DatosPersonalesRecepcionistaProps {
    register: UseFormRegister<ICrearRecepcionistaDTO>;
    errores: FieldErrors<ICrearRecepcionistaDTO>;
}

const DatosPersonalesRecepcionista = ({
    register,
    errores,
}: DatosPersonalesRecepcionistaProps) => (
    <fieldset>
        <legend>Datos Personales</legend>
        <div className={styles.filaInput}>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Nombre y apellido tal como figura en el DNI.</small>
                <input
                    type="text"
                    {...register('nombre')}
                    className={styles.campoInput}
                    placeholder="Nombre Completo"
                />
                {errores.nombre && <span className={styles.error}>{errores.nombre.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Número de documento sin puntos.</small>
                <input
                    type="text"
                    {...register('dni')}
                    className={styles.campoInput}
                    placeholder="DNI"
                />
                {errores.dni && <span className={styles.error}>{errores.dni.message}</span>}
            </div>
        </div>
    </fieldset>
);

export default DatosPersonalesRecepcionista;
