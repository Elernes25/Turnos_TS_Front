import {UseFormRegister,FieldErrors} from 'react-hook-form';
import {IcrearPacienteDTO} from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
}

const Obrasocial = ({ register, errores, styles }: Props) =>(
    <fieldset>
        <legend> Obra Social </legend>
        <input 
            type="text"
            className={styles.campoInput}
            placeholder="Obra Social"
            {...register ('obraSocial.nombreObraSocial')}
        />
        {errores.obraSocial?.nombreObraSocial && <span className={styles.error}>{errores.obraSocial.nombreObraSocial.message}</span>}
        <input 
            type="text"
            className={styles.campoInput}
            placeholder="Número de Afiliado"
            {...register ('obraSocial.numeroAfiliado')}
        />
        {errores.obraSocial?.numeroAfiliado && <span className={styles.error}>{errores.obraSocial.numeroAfiliado.message}</span>}
    </fieldset>

);
export default Obrasocial; 