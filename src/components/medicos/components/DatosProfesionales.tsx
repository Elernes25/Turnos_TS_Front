import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { IcrearMedicoDTO } from '../../../types/Medico.type';
import { SelectEspecialidad } from '../../especialidad/SelectEspecialidad';

interface Props {
    register: UseFormRegister<IcrearMedicoDTO>;
    control: Control<IcrearMedicoDTO>;
    errores: FieldErrors<IcrearMedicoDTO>;
    styles: any;
}

const DatosProfesionales = ({ register, control, errores, styles }: Props) => (
    <fieldset>
        <legend>Datos Profesionales</legend>
        <div className={styles.filaInput}>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Selecciona la especialidad del médico.</small>
                <SelectEspecialidad control={control} styles={styles} />
                {errores.especialidad && (
                    <span className={styles.error}>{errores.especialidad.message}</span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <small className={styles.ayudaCampo}>Número de matrícula profesional.</small>
                <input
                    type="text"
                    {...register('numeroMatricula')}
                    className={styles.campoInput}
                    placeholder="Número de Matrícula"
                />
                {errores.numeroMatricula && (
                    <span className={styles.error}>{errores.numeroMatricula.message}</span>
                )}
            </div>
        </div>
    </fieldset>
);

export default DatosProfesionales;
