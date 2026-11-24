import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {clientesAxios} from "../config/axios";
import { Button, Container, Card, Form, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { LoginDTO,loginSchema } from "../types/Login.types";
import { getSession, saveSession } from "../auth/session";

const Login = () => {
    const navigate = useNavigate();
    const [mostrarPassword, setMostrarPassword] = useState(false);
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

            if (getSession()?.debeCambiarPassword) {
                navigate('/primer-ingreso', {
                    replace: true,
                    state: { email: datos.email },
                });
                return;
            }

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
                        <InputGroup>
                            <Form.Control
                                type={mostrarPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                aria-label="Contraseña"
                                {...register('password')}
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
                        </InputGroup>
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