import { useCallback, useEffect, useState } from "react";
import { Alert,Button, Card, Container,  Form, ListGroup, Spinner} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { clientesAxios } from "../../config/axios";
import { crearEspecialidadSchema} from "../../types/Especialidad.type";
import type{ IcrearEspecialidadDTO, IEspecialidad, IRespuestaEspecialidades} from "../../types/Especialidad.type";
import styles from "./listado.module.scss";

const obtenerValoresIniciales = (): IcrearEspecialidadDTO => ({ nombre: "", descripcion: ""});

const FormularioEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState<IEspecialidad[]>([]);
    const [especialidadEditando, setEspecialidadEditando] = useState<IEspecialidad | null>(null);
    const [cargandoEspecialidades, setCargandoEspecialidades] = useState<boolean>(true);
    const [guardando, setGuardando] = useState<boolean>(false);
    const [mensajeError, setMensajeError] = useState<string>("");
    const [mensajeExito, setMensajeExito] = useState<string>("");

    const {register, handleSubmit, reset, formState: { errors }} = useForm<IcrearEspecialidadDTO>({
        resolver: zodResolver(crearEspecialidadSchema),
        defaultValues: obtenerValoresIniciales(),
    });

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
                setMensajeError("No fue posible cargar las especialidades.");
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
            setMensajeError("");
            setMensajeExito("");
            if (especialidadEditando) {
                await clientesAxios.put(`/especialidad/${especialidadEditando.id}`, datos);
                setMensajeExito("Especialidad actualizada correctamente.");
            } else {
                await clientesAxios.post("/especialidad",datos);
                setMensajeExito("Especialidad creada correctamente.");
            }
            reset(obtenerValoresIniciales());
            setEspecialidadEditando(null);
            await cargarEspecialidades();
        } catch (error:any) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                setMensajeError(error.response?.data?.message ?? "Error al guardar la especialidad." );
            } else {
                setMensajeError("Error inesperado.");
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

    const handleEliminar = async (id: string): Promise<void> => {
        const confirmar = window.confirm( "¿Desea eliminar esta especialidad?" );
        if (!confirmar) return;
        try {
            await clientesAxios.delete(`/especialidad/${id}`);
            setMensajeExito("Especialidad eliminada correctamente.");
            await cargarEspecialidades();
        } catch (error:any) {
            console.error(error);
            setMensajeError("No fue posible eliminar la especialidad.");
        }

    };

    return (
        <Container>
            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0"> {especialidadEditando ? "Editar Especialidad" : "Nueva Especialidad"} </h5>
                </Card.Header>
                <Card.Body>
                    {mensajeExito && (
                        <Alert
                            variant="success"
                            dismissible
                            onClose={() => setMensajeExito("")}
                        >
                            {mensajeExito}
                        </Alert>
                    )}
                    {mensajeError && (
                        <Alert
                            variant="danger"
                            dismissible
                            onClose={() => setMensajeError("")}
                        >
                            {mensajeError}
                        </Alert>
                    )}

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
                <Card.Header  className="d-flex justify-content-between align-items-center">
                    <span> Especialidades Registradas </span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => void cargarEspecialidades() }
                        disabled={cargandoEspecialidades}
                    >
                        Actualizar
                    </Button>

                </Card.Header>
                <ListGroup variant="flush">
                    {cargandoEspecialidades ? (
                        <ListGroup.Item>
                            Cargando...
                        </ListGroup.Item>
                    ) : especialidades.length === 0 ? (
                        <ListGroup.Item> No existen especialidades registradas. </ListGroup.Item>
                    ) : (
                        especialidades.map(
                            (especialidad, index) => (
                                <ListGroup.Item
                                    key={especialidad.id}
                                    className={ `${styles.renglonCompacto}
                                    ${index % 2 === 0 ? styles.renglonPar : styles.renglonImpar}`}
                                >
                                    <div>
                                        <strong>
                                            {especialidad.nombre}
                                        </strong>
                                        {especialidad.descripcion && (
                                            <div className="text-muted small">
                                                {
                                                    especialidad.descripcion
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleEditar(especialidad)}
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={ () => void handleEliminar( especialidad.id) }
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            )
                        )
                    )}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default FormularioEspecialidades;