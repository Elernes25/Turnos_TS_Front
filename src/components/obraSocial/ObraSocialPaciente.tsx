import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import type { Control,FieldErrors,UseFormRegister, UseFormSetValue} from "react-hook-form";
import { clientesAxios } from "../../config/axios";
import type { IObraSocial } from "../../types/ObraSocial.type";
import type { IcrearPacienteDTO } from "../../types/Paciente.type";

interface Props {
    control: Control<IcrearPacienteDTO>;
    register: UseFormRegister<IcrearPacienteDTO>;
    errores: FieldErrors<IcrearPacienteDTO>;
    styles: any;
    setValue: UseFormSetValue<IcrearPacienteDTO>;
}

const ObraSocialPaciente = ({
    control,
    register,
    errores,
    styles,
    setValue,
}: Props) => {
    const { field } = useController({
        name: "obraSocial.obraSocialID",
        control,
    });

    const [obrasSociales, setObrasSociales] = useState<IObraSocial[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerObrasSociales = async () => {
            try {
                const respuesta = await clientesAxios.get("/obraSocial");
                const lista = respuesta.data.datos || respuesta.data;

                if (Array.isArray(lista)) {
                    setObrasSociales(lista);
                } else {
                    console.error(
                        "El backend no devolvió un arreglo válido:",
                        respuesta.data
                    );
                }
            } catch (error) {
                console.error(
                    "Error al cargar las obras sociales de la API:",
                    error
                );
            } finally {
                setCargando(false);
            }
        };

        void obtenerObrasSociales();
    }, []);

    const seleccionada = field.value ?? "";
    const esNinguna = seleccionada === "";

    return (
        <fieldset>
            <legend>Obra Social</legend>

            <div className={styles.filaInput}>
                <div className={styles.grupoCampo}>
                    <small className={styles.ayudaCampo}>
                        Seleccioná la obra social o prepaga del paciente.
                    </small>

                    <select
                        className={styles.campoInput}
                        value={seleccionada}
                        onChange={(e) => {
                            const valor = e.target.value;

                            field.onChange(valor);

                            if (valor === "") {
                                setValue(
                                    "obraSocial.numeroAfiliado",
                                    ""
                                );
                            }
                        }}
                        onBlur={field.onBlur}
                        disabled={cargando}
                    >
                        <option value="">
                            {cargando ? "Cargando..." : "NINGUNA"}
                        </option>

                        {obrasSociales.map((os) => (
                            <option
                                key={os.id}
                                value={os.id}
                            >
                                {os.nombreObraSocial}
                            </option>
                        ))}
                    </select>

                    {errores.obraSocial?.obraSocialID && (
                        <span className={styles.error}>
                            {errores.obraSocial.obraSocialID.message}
                        </span>
                    )}
                </div>

                <div className={styles.grupoCampo}>
                    <small className={styles.ayudaCampo}>
                        Número de afiliado que figura en la credencial.
                    </small>

                    <input
                        type="text"
                        className={styles.campoInput}
                        placeholder="Número de Afiliado"
                        disabled={esNinguna}
                        {...register("obraSocial.numeroAfiliado")}
                    />

                    {errores.obraSocial?.numeroAfiliado && (
                        <span className={styles.error}>
                            {errores.obraSocial.numeroAfiliado.message}
                        </span>
                    )}
                </div>
            </div>
        </fieldset>
    );
};

export default ObraSocialPaciente;