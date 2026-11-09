import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO} from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
}

const DireccionPaciente = ({ register, errores, styles }:Props) =>  (
    <fieldset>
        <legend> Dirección </legend>
        <div className={styles.filaInput} >
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Nombre de la calle donde vive el paciente.</small>
                <input
                    type="text"
                    className={styles.campoInput}   
                    placeholder="Calle"
                    {...register('direccion.calle')}
                />
                {errores.direccion?.calle && <span className={styles.error}>{errores.direccion.calle.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Número de la puerta o domicilio.</small>
                <input
                    type="text"
                    className={styles.campoInput}
                    placeholder="Número"
                    {...register('direccion.numero')}
                />
                {errores.direccion?.numero && <span className={styles.error}>{errores.direccion.numero.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Piso del domicilio, si corresponde.</small>
                <input
                    type="text"
                    className={styles.campoInput}
                    placeholder="Piso"
                    {...register('direccion.piso')}
                />
                {errores.direccion?.piso && <span className={styles.error}>{errores.direccion.piso.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Departamento, si corresponde.</small>
                <input
                    type="text" 
                    className={styles.campoInput}
                    placeholder="Departamento"
                    {...register('direccion.departamento')}
                />
                {errores.direccion?.departamento && <span className={styles.error}>{errores.direccion.departamento.message}</span>}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Barrio o zona del domicilio.</small>
                <input
                    type="text"
                    className={styles.campoInput}
                    placeholder="Barrio"
                    {...register('direccion.barrio')}
                />
                {errores.direccion?.barrio && <span className={styles.error}>{errores.direccion.barrio.message}</span>}
            </div>
        </div>
    </fieldset>

);

export default DireccionPaciente;