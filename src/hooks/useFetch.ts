import { useState, useEffect, useCallback } from 'react';
import { clientesAxios} from '../config/axios';
import { toast } from 'sonner';

export const useFetch = <T>(endpoint:string) => {
    const [response, setResponse] = useState<{datos:T }| null> (null);
    const [data, setData] = useState <T | null> (null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const respuesta = await clientesAxios.get<{datos: T}>(endpoint);
            setResponse(respuesta.data);
            setData(respuesta.data.datos);

        } catch (error:any) {
            setResponse(null);
            setData(null);
            toast.error(`Error al cargar datos o No hay datos almacenados`);
            console.log(`ERROR: ${error.message}`);

        } finally {
            setIsLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return { response, data, setData, isLoading, refetch: fetchData };
}