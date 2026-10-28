import { useEffect, useState } from "react";
import { clientesAxios } from "../../config/axios"; // 

interface Especialidad {
  _id: string;
  especialidadNombre: string;
}

export const SelectEspecialidad = ({ register, styles }: { register: any, styles: any }) => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  useEffect(() => {
    // Definimos la función asíncrona para usar async/await
    const obtenerEspecialidades = async () => {
      try {
        const respuesta = await clientesAxios.get("/especialidad");
       
        const listaEspecialidades = respuesta.data.datos || respuesta.data;

        if (Array.isArray(listaEspecialidades)) {
          setEspecialidades(listaEspecialidades);
        } else {
          console.error("El backend no devolvió un arreglo válido:", respuesta.data);
        }
      } catch (error) {
        console.error("Error al cargar las especialidades de la API:", error);
      }
    };

    obtenerEspecialidades(); // Ejecutamos la función
  }, []);

  return (
    <select {...register("especialidad")} className={styles.campoInput} defaultValue="">
      <option value="" disabled>Seleccione especialidad</option>
      {especialidades?.map((esp) => (
        <option key={esp._id} value={esp._id}>
          {esp.especialidadNombre}
        </option>
      ))}
    </select>
  );
};