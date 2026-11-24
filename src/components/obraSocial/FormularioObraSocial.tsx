import { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Form, ListGroup, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { clientesAxios } from "../../config/axios";
import { crearObraSocialSchema } from "../../types/ObraSocial.type";
import type { IcrearObraSocialDTO,IObraSocial,IRespuestaObrasSociales} from "../../types/ObraSocial.type";
import ModalEliminarObraSocial from "./ModalEliminarObraSocial";
import styles from "./listado.module.scss";

const obtenerValoresIniciales = (): IcrearObraSocialDTO => ({ nombreObraSocial: "" });

const obtenerMensajeError = (error: unknown, porDefecto: string): string =>
    axios.isAxiosError(error)
        ? error.response?.data?.message ?? porDefecto
        : "El servidor está apagado o no responde";

const FormularioObraSocial = () => {
    const [obrasSociales, setObrasSociales] = useState<IObraSocial[]>([]);
    const [obraSocialEditando, setObraSocialEditando] = useState<IObraSocial | null>(null);
    const [obraSocialAEliminar, setObraSocialAEliminar] = useState<IObraSocial | null>(null);
    const [cargandoLista, setCargandoLista] = useState<boolean>(true);
    const [eliminando, setEliminando] = useState<boolean>(false);

    const { register, handleSubmit, reset, setFocus, formState: { errors, isSubmitting }} = useForm<IcrearObraSocialDTO>({
        resolver: zodResolver(crearObraSocialSchema),
        mode: "onChange",
        defaultValues: obtenerValoresIniciales(),
    });

    useEffect(() => {
        if (obraSocialEditando) {
            setFocus("nombreObraSocial");
        }
    }, [obraSocialEditando, setFocus]);

    const cargarObrasSociales = useCallback(async (): Promise<void> => {
        try {
            setCargandoLista(true);
            const respuesta = await clientesAxios.get<IRespuestaObrasSociales>("/obraSocial");
            setObrasSociales(respuesta.data.datos ?? []);
        } catch (error: unknown) {
            console.error(error);
            toast.error("No fue posible cargar las obras sociales.");
        } finally {
            setCargandoLista(false);
        }
    }, []);

    useEffect(() => {  void cargarObrasSociales(); }, [cargarObrasSociales]);

    const onSubmit = async (datos: IcrearObraSocialDTO): Promise<void> => {
        try {
            if (obraSocialEditando) {
                await clientesAxios.put(`/obraSocial/${obraSocialEditando.id}`, datos);
                toast.success("Obra social actualizada correctamente");
            } else {
                await clientesAxios.post("/obraSocial", datos);
                toast.success("Obra social creada correctamente");
            }
            reset(obtenerValoresIniciales());
            setObraSocialEditando(null);
            await cargarObrasSociales();
        } catch (error: unknown) {
            console.error(error);
            toast.error(obtenerMensajeError(error, "Error al guardar la obra social"));
        }
    };

    const handleEditar = (obraSocial: IObraSocial): void => {
        setObraSocialEditando(obraSocial);
        reset({ nombreObraSocial: obraSocial.nombreObraSocial });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelarEdicion = (): void => { setObraSocialEditando(null); reset(obtenerValoresIniciales()); };

    const confirmarEliminacion = async (): Promise<void> => {
        if (!obraSocialAEliminar) return;

        try {
            setEliminando(true);
            await clientesAxios.delete(`/obraSocial/${obraSocialAEliminar.id}`);
            toast.success("Obra social eliminada correctamente");
            // si estaba editando justo esa, salir del modo edición
            if (obraSocialEditando?.id === obraSocialAEliminar.id) {
                handleCancelarEdicion();
            }
            setObraSocialAEliminar(null);
            await cargarObrasSociales();
        } catch (error: unknown) {
            console.error(error);
            toast.error(obtenerMensajeError(error, "No fue posible eliminar la obra social"));
        } finally {
            setEliminando(false);
        }
    };

    return (
        <Container>
            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">
                        {obraSocialEditando ? "Editar Obra Social" : "Nueva Obra Social"}
                    </h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Obra Social</Form.Label>
                            <Form.Control type="text" placeholder="Ej: PAMI" {...register("nombreObraSocial")} />
                            {errors.nombreObraSocial && (
                                <div className="text-danger mt-1">{errors.nombreObraSocial.message}</div>
                            )}
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <> <Spinner animation="border" size="sm" /> Guardando... </>
                                ) : obraSocialEditando ? ( "Actualizar" ) : ("Crear")
                                }
                            </Button>

                            {obraSocialEditando && (
                                <Button variant="secondary" onClick={handleCancelarEdicion}>
                                    Cancelar edición
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <span>Obras Sociales Registradas</span>
                </Card.Header>
                <ListGroup variant="flush">
                    {cargandoLista ? (
                        <ListGroup.Item>Cargando...</ListGroup.Item>
                    ) : obrasSociales.length === 0 ? (
                        <ListGroup.Item>No existen obras sociales registradas.</ListGroup.Item>
                    ) : (
                        obrasSociales.map((obraSocial, index) => (
                            <ListGroup.Item
                                key={obraSocial.id}
                                className={`d-flex justify-content-between align-items-center ${styles.renglonCompacto}
                                    ${index % 2 === 0 ? styles.renglonPar : styles.renglonImpar}`}
                            >
                                <strong>{obraSocial.nombreObraSocial}</strong>

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEditar(obraSocial)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setObraSocialAEliminar(obraSocial)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>
            <ModalEliminarObraSocial
                obraSocial={obraSocialAEliminar}
                eliminando={eliminando}
                onCancelar={() => setObraSocialAEliminar(null)}
                onConfirmar={() => void confirmarEliminacion()}
            />
        </Container>
    );
};

export default FormularioObraSocial;
