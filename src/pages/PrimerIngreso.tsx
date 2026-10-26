import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {Container,Card,Button} from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { clientesAxios } from "../config/axios";
import { toast } from "sonner";
import styles from "./PrimerIngreso.module.scss";
import { clearSession } from "../auth/session";

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
    const { register, handleSubmit, formState:{errors,isSubmitting}} = useForm<IprimerIngresoSchema>({
        resolver:zodResolver(primerIngresoSchema)
    });

    const onSubmit = async (data:any) => {
        await clientesAxios.put('/auth/usuarios/cambiar-password', {
                passwordNueva:data.password
            }
        );
        toast.success( "Contraseña actualizada correctamente" );
        clearSession();
        navigate('/login');
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
                        Guardar
                    </Button>

                </form>
            </Card>
        </Container>
    );
};

export default PrimerIngreso;