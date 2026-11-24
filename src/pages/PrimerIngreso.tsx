import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {Container,Card,Button} from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { clientesAxios } from "../config/axios";
import { toast } from "sonner";
import styles from "./PrimerIngreso.module.scss";
import { clearSession, saveSession } from "../auth/session";
import { obtenerMensajeError } from "../components/utils/obtenerMensajeError";

export const primerIngresoSchema = z
.object({
    password: z
        .string()
        .min(8,"Debe tener al menos 8 caracteres"),
    repetirPassword: z.string()
})
.refine(
    data => data.password === data.repetirPassword,
    {
        message: "Las contraseñas no coinciden",
        path:["repetirPassword"]
    }
);
export type IprimerIngresoSchema = z.input<typeof primerIngresoSchema>;

const PrimerIngreso = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const email = typeof location.state?.email === 'string' ? location.state.email : '';
    const { register, handleSubmit, formState:{errors,isSubmitting}} = useForm<IprimerIngresoSchema>({
        resolver:zodResolver(primerIngresoSchema)
    });

    const onSubmit = async (data: IprimerIngresoSchema): Promise<void> => {
        if (!email) {
            toast.error('No se pudo recuperar el e-mail. Inicie sesión nuevamente.');
            navigate('/login', { replace: true });
            return;
        }

        let passwordActualizada = false;
        try {
            await clientesAxios.put('/auth/usuarios/cambiar-password', {
                passwordNueva: data.password,
            });
            passwordActualizada = true;
            clearSession();

            const respuesta = await clientesAxios.post<{ datos?: { token?: string } }>('/auth/login', {
                email,
                password: data.password,
            });
            const token = respuesta.data.datos?.token;

            if (!token) {
                toast.error('La contraseña se actualizó, pero no se pudo iniciar sesión automáticamente. Ingrese con la nueva contraseña.');
                navigate('/login', { replace: true });
                return;
            }

            saveSession(token);
            toast.success('Contraseña actualizada. Ingreso exitoso.');
            navigate('/', { replace: true });
        } catch (error: unknown) {
            toast.error(obtenerMensajeError(error));
            if (passwordActualizada) {
                navigate('/login', { replace: true });
            }
        }
    };

    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Card className="p-4 shadow" style={{width:'450px'}}>
                <h3>Primer ingreso al sistema</h3>
                <p>Debe ingresar una nueva contraseña para continuar.</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Nueva contraseña"
                        {...register("password")}
                    />
                    {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Repetir contraseña"
                        {...register("repetirPassword")}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-100"
                    >
                        {isSubmitting ? "Ingresando..." : "Guardar y continuar"}
                    </Button>

                </form>
            </Card>
        </Container>
    );
};

export default PrimerIngreso;