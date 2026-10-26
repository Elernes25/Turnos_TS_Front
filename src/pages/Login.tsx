import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {clientesAxios} from "../config/axios";
import { Button, Container, Card } from "react-bootstrap";
import { LoginDTO,loginSchema } from "../types/Login.types";
import { saveSession } from "../auth/session";

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });
    /*
     const location = useLocation();
    const navigate = useNavigate();
    const ciudadano = location.pathname.endsWith('/ciudadano');
    const onSuccess = (result: AuthResult) => {
        saveSession(result.token);
        const role: UserRole | null = result.paciente ? 'PACIENTE' : null;
        toast.success('Ingreso exitoso.');
        navigate(role === 'PACIENTE' ? '/ciudadano/turnos' : '/', { replace: true });
    };
   
    */

    const onSubmit = async (datos: LoginDTO) => {
        try {
            const respuesta = await clientesAxios.post('/auth/login', datos);
            const token = respuesta.data.datos.token;
            /*almaceno token */
            //localStorage.setItem('token', token);
            saveSession(token);

            console.log("Token guardado en localStorage:", token);
            console.log("login exito" );
            toast.success("Ingreso fue exitoso");
            navigate('/'); //navigate('/dashboard'); 
        } catch (error: any) {
            console.log("Error al iniciar sesión:", error);
            toast.error(error.response?.data?.mensaje || "Error al iniciar sesión");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h3 className="text-center mb-4">Ingreso al Sistema</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email" {...register('email')} />
                        {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>
                    
                    <div className="mb-4">
                        <input type="password" className="form-control" placeholder="Contraseña" {...register('password')} />
                        {errors.password && <small className="text-danger">{errors.password.message}</small>}
                    </div>
                    <Button type="submit" className="w-100" disabled={isSubmitting}>
                        {isSubmitting ? "Ingresando..." : "Ingresar"}
                    </Button>
                </form>
            </Card>
        </Container>
    );
};

export default Login;