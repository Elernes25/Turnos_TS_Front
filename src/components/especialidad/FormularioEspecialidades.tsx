import { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { clientesAxios } from "../../config/axios";
import { crearEspecialidadSchema} from "../../types/Especialidad.type";
import type{ IcrearEspecialidadDTO, IEspecialidad, IRespuestaEspecialidades} from "../../types/Especialidad.type";
import ListadoEspecialidad from "./components/ListadoEspecialidad";
import ModalEliminarEspecialidad from "./components/ModalEliminarEspecialidad";

const obtenerValoresIniciales = (): IcrearEspecialidadDTO => ({ nombre: "", descripcion: ""});

const FormularioEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState<IEspecialidad[]>([]);
    const [especialidadEditando, setEspecialidadEditando] = useState<IEspecialidad | null>(null);
    const [especialidadAEliminar, setEspecialidadAEliminar] = useState<IEspecialidad | null>(null);
    const [cargandoEspecialidades, setCargandoEspecialidades] = useState<boolean>(true);
    const [guardando, setGuardando] = useState<boolean>(false);
    const [eliminandoEspecialidad, setEliminandoEspecialidad] = useState<boolean>(false);

    const {register, handleSubmit, reset, setFocus, formState: { errors }} = useForm<IcrearEspecialidadDTO>({
        resolver: zodResolver(crearEspecialidadSchema),
        defaultValues: obtenerValoresIniciales(),
    });

    useEffect(() => {
        if (especialidadEditando) {
            setFocus("nombre");
        }
    }, [especialidadEditando, setFocus]);

    const cargarEspecialidades = useCallback(async (): Promise<void> => {
            try {
                setCargandoEspecialidades(true);
                const respuesta = await clientesAxios.get<IRespuestaEspecialidades>("/especialidad");
                setEspecialidades( respuesta.data.datos ?? []);
                console.log("respuesta:", respuesta);
                console.log("data:", respuesta.data);
                console.log("data:", respuesta.data.datos);
                console.log( JSON.stringify( respuesta.data.datos,null, 2  ));

            } catch (error:any) {
                console.error(error);
                toast.error("No fue posible cargar las especialidades.");
            } finally {
                setCargandoEspecialidades(false);
            }
        },
        []
    );

    useEffect(() => {void cargarEspecialidades();}, [cargarEspecialidades]);

    const onSubmit = async ( datos: IcrearEspecialidadDTO): Promise<void> => {
        try {
            setGuardando(true);
            if (especialidadEditando) {
                await clientesAxios.put(`/especialidad/${especialidadEditando.id}`, datos);
                toast.success("Especialidad actualizada correctamente.");
            } else {
                await clientesAxios.post("/especialidad",datos);
                toast.success("Especialidad creada correctamente.");
            }
            reset(obtenerValoresIniciales());
            setEspecialidadEditando(null);
            await cargarEspecialidades();
        } catch (error:any) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message ?? "Error al guardar la especialidad.");
            } else {
                toast.error("Error inesperado.");
            }
        } finally {
            setGuardando(false);
        }
    };

    const handleEditar = ( especialidad: IEspecialidad): void => {
        setEspecialidadEditando(especialidad);
        reset({
            nombre: especialidad.nombre,
            descripcion:especialidad.descripcion ?? "",
        });
        window.scrollTo({top: 0,behavior: "smooth" });
    };

    const handleCancelarEdicion = (): void => {setEspecialidadEditando(null); reset(obtenerValoresIniciales()); };

    const confirmarEliminacion = async (): Promise<void> => {
        if (!especialidadAEliminar) return;

        try {
            setEliminandoEspecialidad(true);
            await clientesAxios.delete(`/especialidad/${especialidadAEliminar.id}`);
            toast.success("Especialidad eliminada correctamente.");
            setEspecialidadAEliminar(null);
            await cargarEspecialidades();
        } catch (error:any) {
            console.error(error);
            toast.error("No fue posible eliminar la especialidad.");
        } finally {
            setEliminandoEspecialidad(false);
        }

    };

    return (
        <Container>
            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0"> {especialidadEditando ? "Editar Especialidad" : "Nueva Especialidad"} </h5>
                </Card.Header>
                <Card.Body>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                {...register("nombre")}
                            />
                            {errors.nombre && (
                                <div className="text-danger mt-1">
                                    {errors.nombre.message}
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> Descripción </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                {...register("descripcion")}
                            />

                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={guardando} >
                                {guardando ? ( 
                                    <>
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                        />{" "}
                                        Guardando...
                                    </>
                                ) : especialidadEditando ? (
                                    "Actualizar"
                                ) : (
                                    "Crear"
                                )}
                            </Button>

                            {especialidadEditando && (
                                <Button
                                    variant="secondary"
                                    onClick={ handleCancelarEdicion}
                                >
                                    Cancelar edición
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    <span> Especialidades Registradas </span>
                </Card.Header>
                <ListadoEspecialidad
                    especialidades={especialidades}
                    cargando={cargandoEspecialidades}
                    onEditar={handleEditar}
                    onSolicitarEliminacion={setEspecialidadAEliminar}
                />
            </Card>
            <ModalEliminarEspecialidad
                especialidad={especialidadAEliminar}
                eliminando={eliminandoEspecialidad}
                onCancelar={() => setEspecialidadAEliminar(null)}
                onConfirmar={() => void confirmarEliminacion()}
            />
        </Container>
    );
};

export default FormularioEspecialidades;