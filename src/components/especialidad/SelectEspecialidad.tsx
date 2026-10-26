/* import { useEffect, useState } from "react";
import axios from "axios";

export const SelectEspecialidad = ({ register, styles }: {register:any, styles:any}) => {
  // {register:any, styles:any} son any porque puede venir de medicoDTO o de algun otro lado,
  // y no quiero hacer un tipo generico para todos los DTOs que tengan especialidad
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    axios.get("/especialidad").then(res => setEspecialidades(res.data));
  }, []);

  return (
    <select {...register("especialidad")} className={styles.campoInput}>
      <option value="" disabled>Seleccione especialidad</option>
      {especialidades.map((esp: any) => (
        <option key={esp._id} value={esp._id}>
          {esp.especialidadNombre}
        </option>
      ))}
    </select>
  );
};
*/

import { useEffect, useState } from "react";
import { clientesAxios } from "../../config/axios"; // 🌟 Mantenemos tu cliente configurado

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
        
        // Extraemos '.datos' siguiendo la estructura de tu backend
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