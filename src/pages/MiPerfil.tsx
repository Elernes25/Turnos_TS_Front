import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, Card, Container, Form, InputGroup, Spinner } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { clientesAxios } from "../config/axios";
import { useFetch } from "../hooks/useFetch";
import { getSession } from "../auth/session";
import { RolUsuario, userRolSchema } from "../types/Usuario.type";
import { obtenerMensajeError } from "../components/utils/obtenerMensajeError";
import { saveSession } from "../auth/session";

const perfilUsuarioSchema = z.object({
    dni: z.string(),
    fechaCreacion: z.string(),
    rol: userRolSchema,
    email: z.email(),
    user: z.string(),
});

const actualizarPerfilSchema = z.object({
    user: z.string()
        .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
        .refine((user) => user.trim().length >= 4, "El nombre de usuario es obligatorio"),
    password: z.string().refine(
        (password) => password === "" || password.length >= 8,
        "La contraseña debe tener al menos 8 caracteres",
    ),
});

type IPerfilUsuario = z.infer<typeof perfilUsuarioSchema>;
type IActualizarPerfilForm = z.infer<typeof actualizarPerfilSchema>;

const rutasDashboard: Partial<Record<RolUsuario, string>> = {
    [RolUsuario.ADMIN]: "/recepcion",
    [RolUsuario.SUPERVISOR]: "/supervisor",
    [RolUsuario.MEDICO]: "/medico",
    [RolUsuario.RECEPCIONISTA]: "/recepcion",
};

const formatearFechaAlta = (fecha: string): string => {
    const fechaConvertida = new Date(fecha);
    return Number.isNaN(fechaConvertida.getTime())
        ? fecha
        : fechaConvertida.toLocaleDateString("es-AR", { timeZone: "UTC" });
};

const MiPerfil = () => {
    const navigate = useNavigate();
    const session = getSession();
    const rutaDashboard = session ? rutasDashboard[session.rol] ?? "/403" : "/login";
    const { response, isLoading: cargando } = useFetch<unknown>(
        `/auth/usuarios/?id=${encodeURIComponent(session?.id ?? "")}`,
    );
    const [perfil, setPerfil] = useState<IPerfilUsuario | null>(null);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting },
    } = useForm<IActualizarPerfilForm>({ resolver: zodResolver(actualizarPerfilSchema),
        defaultValues: { user: "", password: "" },
    });

    useEffect(() => {
        if (cargando) return;
        if (!response) {
            setErrorCarga("No fue posible cargar el perfil.");
            return;
        }

        try {
            const datosPerfil = perfilUsuarioSchema.parse(response.datos);
            setPerfil(datosPerfil);
            reset({ user: datosPerfil.user, password: "" });
        } catch (error: unknown) {
            const mensaje = obtenerMensajeError(error);
            setErrorCarga(mensaje);
            toast.error(mensaje);
        }
    }, [cargando, response, reset]);

    const onSubmit = async (datos: IActualizarPerfilForm): Promise<void> => {
        const datosActualizacion = { user: datos.user.trim(),...(datos.password ? { password: datos.password } : {}),};
        try {
            const respuesta = await clientesAxios.put("/auth/usuarios/actualizar", datosActualizacion);
            saveSession(respuesta.data.datos.token);
            setPerfil((actual) => actual ? { ...actual, user: datosActualizacion.user } : actual);
            reset({ user: datosActualizacion.user, password: "" });
            toast.success("Perfil actualizado correctamente.");
        } catch (error: unknown) {
            toast.error(obtenerMensajeError(error));
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Header>
                    <h1 className="h4 mb-0">Mi Perfil</h1>
                </Card.Header>
                <Card.Body>
                    {cargando ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando perfil...</span>
                            </Spinner>
                        </div>
                    ) : errorCarga ? (
                        <Alert variant="danger">{errorCarga}</Alert>
                    ) : perfil && (
                        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="d-flex flex-wrap gap-3 mb-4">
                                <span><strong>DNI:</strong> {perfil.dni}</span>
                                <span><strong>Fecha de alta:</strong> {formatearFechaAlta(perfil.fechaCreacion)}</span>
                                <span><strong>Rol:</strong> {perfil.rol}</span>
                                <span><strong>Email:</strong> {perfil.email}</span>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="username"
                                    isInvalid={Boolean(errors.user)}
                                    {...register("user")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.user?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Nueva contraseña</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type={mostrarPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Dejar vacía para no cambiarla"
                                        isInvalid={Boolean(errors.password)}
                                        {...register("password")}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        aria-pressed={mostrarPassword}
                                        onClick={() => setMostrarPassword((visible) => !visible)}
                                    >
                                        {mostrarPassword ? <EyeSlash aria-hidden="true" /> : <Eye aria-hidden="true" />}
                                    </Button>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <div className="d-flex gap-2">
                                <Button type="button" variant="outline-secondary" onClick={() => navigate(rutaDashboard)}>
                                    Volver
                                </Button>
                                <Button type="submit" disabled={!isDirty || isSubmitting}>
                                    {isSubmitting ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </Form>
                    )}
                    {!cargando && errorCarga && (
                        <div className="d-flex gap-2">
                            <Button type="button" variant="outline-secondary" onClick={() => navigate(rutaDashboard)}>
                                Volver
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MiPerfil;
