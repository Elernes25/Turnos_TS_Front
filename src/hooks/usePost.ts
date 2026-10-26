import { useState, useEffect } from "react";
import { clientesAxios } from "../config/axios";
import { toast } from "sonner";

export const usePost = <T = any>(endpoint: string, payload?: Record<string, unknown>) => {
  const [response, setResponse] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!payload) return console.log("No hay datos para enviar"); // no enviar si no hay datos

    const sendData = async () => {
      setIsLoading(true);
      try {
        const res = await clientesAxios.post<T>(endpoint, payload);
        setResponse(res.data);
        toast.success("Datos enviados correctamente");
      } catch (err: any) {
        setError(err);
        toast.error("Error al enviar datos");
        console.error("ERROR:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    sendData();
  }, [endpoint, payload]);

  return { response, isLoading, error };
};
