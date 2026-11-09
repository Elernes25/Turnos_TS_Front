import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";
import { clientesAxios } from "../../config/axios";
import type { IEspecialidad } from "../../types/Especialidad.type";
import type { IcrearMedicoDTO } from "../../types/Medico.type";

interface Props {
  control: Control<IcrearMedicoDTO>;
  styles: any;
}

export const SelectEspecialidad = ({ control, styles }: Props) => {
  const { field } = useController({ name: "especialidad", control });
  const [especialidades, setEspecialidades] = useState<IEspecialidad[]>([]);

  const seleccionadas: string[] = field.value ?? [];

  useEffect(() => {
    const obtenerEspecialidades = async () => {
      try {
        const respuesta = await clientesAxios.get("/especialidad");
        const lista = respuesta.data.datos || respuesta.data;

        if (Array.isArray(lista)) {
          setEspecialidades(lista);
        } else {
          console.error("El backend no devolvió un arreglo válido:", respuesta.data);
        }
      } catch (error) {
        console.error("Error al cargar las especialidades de la API:", error);
      }
    };
    obtenerEspecialidades();
  }, []);

  // solo se ofrecen las que todavía no fueron agregadas
  const disponibles = especialidades.filter((e) => !seleccionadas.includes(e.id));

  const agregar = (id: string) => {
    if (!id) return;
    field.onChange([...seleccionadas, id]);
  };

  const quitar = (id: string) => {
    field.onChange(seleccionadas.filter((x) => x !== id));
  };

  const nombreDe = (id: string) =>
    especialidades.find((e) => e.id === id)?.nombre ?? id;

  return (
    <div>
      <select
        value=""                       // siempre vuelve a "Seleccione..." tras agregar
        onChange={(e) => agregar(e.target.value)}
        onBlur={field.onBlur}
        className={styles.campoInput}
        disabled={disponibles.length === 0}
      >
        <option value="" disabled>
          {disponibles.length === 0
            ? "No hay más especialidades"
            : "Agregar especialidad..."}
        </option>
        {disponibles.map((esp) => (
          <option key={esp.id} value={esp.id}>
            {esp.nombre}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0" }}>
        {seleccionadas.map((id) => (
          <span
            key={id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 16,
              background: "#e7f1ff",
              color: "#0b5ed7",
              fontSize: 14,
            }}
          >
            {nombreDe(id)}
            <button
              type="button"            // importante: evita que dispare el submit
              onClick={() => quitar(id)}
              aria-label={`Quitar ${nombreDe(id)}`}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", padding: 0 }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};