import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';
import { clientesAxios } from '../../config/axios';
import { crearAgendaMedicoSchema, ICrearAgendaMedicoDTO, DiaSemana,} from '../../types/Agenda.types';

import { IMedico } from '../../types/Medico.type';
import DiaItem from '../administrador/components/DiaItem';
import styles from './FormularioUsuario.module.scss';

const FormularioAgendaMedico = () => {
    const { id } = useParams<{ id: string }>();

    const { register, control, handleSubmit, setValue, reset, formState: { errors, isSubmitting },
    } = useForm<ICrearAgendaMedicoDTO>({ resolver: zodResolver(crearAgendaMedicoSchema),
        defaultValues: {
            medicoId: '',
            dias: [],
            duracionTurnoMinutos: 15,
        },
    });

    const { data: medicos } = useFetch<IMedico[]>('/medicos');
    const medicoSeleccionado = medicos?.find((medico) => medico.id === id);

    const [esEdicion, setEsEdicion] = useState(false);
    const [cargandoAgenda, setCargandoAgenda] = useState(true);

    useEffect(() => {
    if (!id) return;

    const cargarAgenda = async (): Promise<void> => {
        try {
            const { data } = await clientesAxios.get(`/medicos/${id}/agenda`);
            // validamos con el mismo schema del formulario
            const agenda = crearAgendaMedicoSchema.parse({ ...data.datos, medicoId: id });
            reset(agenda);
            setEsEdicion(true);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                // no tiene agenda: modo creación
                setValue('medicoId', id, { shouldValidate: true });
            } else {
                alert('No se pudo cargar la agenda del médico');
            }
        } finally {
            setCargandoAgenda(false);
        }
    };
    void cargarAgenda();
    }, [id, reset, setValue]);

    const {fields: diasSeleccionados, append: appendDia, remove: removeDia} = useFieldArray({ control, name: 'dias'});

    const onSubmit = async (datosValidados: ICrearAgendaMedicoDTO): Promise<void> => {
    try {
        if (esEdicion) {
            await clientesAxios.put(`/medicos/${id}/agenda`, datosValidados); //mando la Id del medico
            alert('Agenda actualizada con éxito');
        } else {
            await clientesAxios.post('/medicos/agenda', datosValidados);
            alert('Agenda creada con éxito');
            setEsEdicion(true); // si guarda de nuevo, ya sería PUT
        }
    } catch (error: unknown) {
        const mensaje = axios.isAxiosError(error)
            ? error.response?.data?.message ?? 'Error del servidor'
            : 'El servidor está apagado o no responde';
        alert(mensaje);
    }
    };

    return (
        <div className={`${styles.contenedorFormulario} mx-auto my-4 shadow-sm`} style={{ maxWidth: '48rem' }} >
             
            <div className={styles.encabezado}>
                <div>
                    <h1>{esEdicion ? 'Editar Agenda Médica' : 'Configuración de Agenda Médica'}</h1>
                </div>
            </div>

            <Card.Body className="p-4">
                <Form onSubmit={handleSubmit(onSubmit)} noValidate >
                    <Form.Group className="mb-4">
                        <Form.Label>Médico</Form.Label>
                        <Form.Control
                            type="text"
                            value={medicoSeleccionado?.nombre ?? ''}
                            disabled
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group className={styles.contenedorFormulario} controlId="duracionTurnoMinutos" >
                        <Form.Label> Duración estándar de cada turno (minutos)</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            max={60}
                            isInvalid={!!errors.duracionTurnoMinutos}
                            {...register('duracionTurnoMinutos', {
                                    valueAsNumber: true,
                                }
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.duracionTurnoMinutos?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex flex-column gap-3 mb-4">
                        {Object.values(DiaSemana).map((dia) => {
                            const indiceEnArray =diasSeleccionados.findIndex((d) => d.diaSemana === dia );
                            const esActivo = indiceEnArray !== -1;

                            return (
                                <DiaItem
                                    key={dia}
                                    nombreDia={dia}
                                    isActivo={esActivo}
                                    indexEnArray={indiceEnArray }
                                    appendDia={appendDia}
                                    removeDia={removeDia}
                                    control={control}
                                    errors={errors}
                                    register={register}
                                    styles={styles}
                                />
                            );
                        })}
                        
                   
                    </div>

                    <div className="d-grid">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={ isSubmitting || !medicoSeleccionado }
                        >
                           {isSubmitting ? 'Guardando...'
                                : esEdicion ? 'Guardar Cambios' : 'Guardar Agenda'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </div>
    );
};

export default FormularioAgendaMedico;