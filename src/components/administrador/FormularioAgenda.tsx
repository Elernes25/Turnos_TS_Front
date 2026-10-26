import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from "react";
import { useFetch } from '../../hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {clientesAxios} from '../../config/axios'
import { Form, Button, Card} from 'react-bootstrap';
import { crearAgendaMedicoSchema,ICrearAgendaMedicoDTO,DiaSemana } from '../../types/Agenda.types';
import BuscadorMedicos from '../medicos/components/BuscadorMedicos';
import { IMedico } from "../../types/Medico.type";
import DiaItem from  "../administrador/components/DiaItem";
import styles from './FormularioUsuario.module.scss';


/*interface Props {
  medicoId: string;
}*/
const FormularioAgendaMedico = () => {
//const FormularioAgendaMedico: React.FC<Props> = () => {
    const { register, control, handleSubmit, watch, setValue, formState: { errors, isSubmitting },
    } = useForm<ICrearAgendaMedicoDTO>({
    resolver: zodResolver(crearAgendaMedicoSchema),
    defaultValues: { dias:[] }
    });
    
    const valoresActuales = watch(); 
    console.log("ESTADO ACTUAL DEL FORMULARIO COMPLETO:----->", valoresActuales);


    const { fields: diasSeleccionados, append: appendDia, remove: removeDia } = useFieldArray({
    control,
    name: "dias"
    });

    const [busqueda, setBusqueda] = useState<string>("");
    const { response: response, data: medicos, setData: setMedicos, isLoading } = useFetch<IMedico[]>('/medicos');
    console.log("Medicos:", medicos);
    console.log("Response en Formulario Agenda:", response);
    //  const medicosFiltrados = (medicos || []).filter(medico =>
    //        (medico.nombre ?? "medico sin asignar").toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    //    );
    //const medicoEncontrado = medicos?.find(
    //medico => medico.nombre.toLowerCase().includes(busqueda.toLowerCase())
    //);
/**********************/
    const medicoEncontrado = busqueda.trim() !== "" 
    ? medicos?.find(medico => medico.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : undefined;
    useEffect(() => {
        if (medicoEncontrado) {
            setValue("medicoId", medicoEncontrado.id, { shouldValidate: true });
        } else {
            setValue("medicoId", "", { shouldValidate: true });
        }
    }, [medicoEncontrado, setValue]);
    console.log ("Medico Encontrado:----->",medicoEncontrado);
/**********************/
    const onSubmit = async (datosValidados: ICrearAgendaMedicoDTO) => {
        
        if (!medicoEncontrado) { 
            console.log("No se encontró médico para asignar su agenda");
            return
        }
        datosValidados.medicoId = medicoEncontrado.id;

        try {
            await clientesAxios.post('/medicos/agenda', datosValidados);    
            alert('Agenda creada con éxito');
        } catch (error:any) {
            const mensaje = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Error del servidor"
                : "el servidor esta apagado o no responde";
            alert(mensaje); /*hacer con sonner toast */
        };
        console.log(datosValidados);
    };

    return (
        <Card className={`${styles.contenedorFormulario} mx-auto my-4 shadow-sm`} style={{ maxWidth: '48rem' }}>
        <BuscadorMedicos valor={busqueda} alCambiar={setBusqueda} />

        <Card.Body className="p-4">
            <Form onSubmit={handleSubmit(onSubmit, (err) => console.log("Errores de validación:=====>", err))} noValidate>
            <h2 className={styles.contenedorFormulario}> Configuración de Agenda Médica</h2>
   
            <Form.Group className={styles.contenedorFormulario} controlId="duracionTurnoMinutos">
            <Form.Label>Duración estándar de cada turno (minutos)</Form.Label>
            <Form.Control
                type="number"
                defaultValue={30}
                min={1}
                max={60}
                isInvalid={!!errors.duracionTurnoMinutos}
                {...register('duracionTurnoMinutos', { valueAsNumber: true })}
            />
            <Form.Control.Feedback type="invalid">
                {errors.duracionTurnoMinutos?.message}
            </Form.Control.Feedback>
            </Form.Group>
    {/***************/}
                <div className="d-flex flex-column gap-3 mb-4">
                    {Object.values(DiaSemana).map((dia) => {
                    // Averiguamos si este día específico ya fue agregado al array de Zod
                        const indiceEnArray = diasSeleccionados.findIndex((d) => d.diaSemana === dia);
                        const esActivo = indiceEnArray !== -1;
                        console.log ("DIA CARGADO****>",dia);
                        return (
                        <DiaItem
                            key={dia}
                            nombreDia={dia}
                            isActivo={esActivo}
                            indexEnArray={indiceEnArray} // Si no está, será -1
                            appendDia={appendDia}
                            removeDia={removeDia}
                            control={control}
                            register={register}
                           
                        />
                    );
                    })}
                    </div>
    {/***************/}

            <div className="d-grid">
                <Button type="submit" variant="primary" disabled={isSubmitting || !medicoEncontrado}>
                {isSubmitting ? 'Guardando...' : 'Guardar Configuración de Agenda'}
                </Button>

            </div>
            </Form>
        </Card.Body>
        </Card>
    );
};

export default FormularioAgendaMedico;