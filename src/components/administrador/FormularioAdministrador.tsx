import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
 
import styles from './FormularioUsuario.module.scss';
import { clientesAxios } from '../../config/axios';
 
import { crearUsuarioSchema, RolUsuario, type ICrearUsuarioDTO} from '../../types/Usuario.type';
 
interface IUsuario {
    _id: string;
    user: string;
    dni: string;
    email: string;
    rol: RolUsuario;
    activo: boolean;
    fechaCreacion: string;
    debeCambiarPassword: boolean;
}

interface IRespuestaUsuarios {
    success: boolean;
    message: string;
    total: number;
    datos: IUsuario[];
}

const obtenerValoresIniciales = (): ICrearUsuarioDTO => ({
    user: '',
    dni: '',
    email: '',
    password: '',
    //activo: true,
    rol: RolUsuario.PACIENTE,
    //fechaCreacion: new Date().toISOString(),
    //debeCambiarPassword: true
});
 
const FormularioUsuario = () => {
const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
const [cargandoUsuarios, setCargandoUsuarios] = useState<boolean>(true);
const [guardandoUsuario, setGuardandoUsuario] = useState<boolean>(false);
const [mensajeError, setMensajeError] = useState<string>('');
const [mensajeExito, setMensajeExito] = useState<string>('');
 
const {register,handleSubmit, reset, formState: { errors }} = useForm<ICrearUsuarioDTO>({
        resolver: zodResolver(crearUsuarioSchema),
        defaultValues: obtenerValoresIniciales()
    });


const cargarUsuarios = useCallback(async (): Promise<void> => {
    setCargandoUsuarios(true);
    setMensajeError('');
 
    try {
        const respuesta = await clientesAxios.get<IRespuestaUsuarios>('/auth/usuarios' );
        console.log(respuesta);
       // const contenido = respuesta.data;
        console.log(respuesta.data);
 /*
        if (Array.isArray(contenido)) {
            setUsuarios(contenido);
            return;
        }
 
        if (Array.isArray(contenido.datos)) {
            setUsuarios(contenido.datos);
            return;
        }
 
       if (Array.isArray(contenido.usuarios)) {
            setUsuarios(contenido.usuarios);
            return;
        }
 */
        //setUsuarios([]);
        setUsuarios(respuesta.data.datos ?? [])
    } catch (error: unknown) {
        console.error('Error al cargar los usuarios:', error);
         
        if (axios.isAxiosError(error)) { 
            setMensajeError( error.response?.data?.message ?? 'No fue posible cargar el listado de usuarios.');
        } else {
            setMensajeError('Ocurrió un error inesperado al cargar los usuarios.');
        }
    } finally {
        setCargandoUsuarios(false);
    }
    }, []);
 
    useEffect(() => { void cargarUsuarios();}, [cargarUsuarios]); 
    const onSubmit = async ( datosValidados: ICrearUsuarioDTO): Promise<void> => {
        setGuardandoUsuario(true);
        setMensajeError('');
        setMensajeExito('');
 
        const datosUsuario: ICrearUsuarioDTO = {
            ...datosValidados
           // fechaCreacion: new Date().toISOString(),
           // debeCambiarPassword: true
        };
 
    try {
        await clientesAxios.post('/auth/register', datosUsuario);
        setMensajeExito('El usuario fue creado correctamente.');
        reset(obtenerValoresIniciales());
        await cargarUsuarios();

    } catch (error: unknown) {
        
        console.error('Error al crear el usuario:', error);

        if (axios.isAxiosError(error)) {
            setMensajeError( error.response?.data?.message ?? 'El servidor no pudo crear el usuario.');
        } else {
            setMensajeError( 'El servidor está apagado o no responde.');
        }
    } finally {
        setGuardandoUsuario(false);
    }
    };
     
    return (
        <div className={styles.contenedorFormulario}>
        <h2>Administración de usuarios</h2>
        <p> Formulario para crear una cuenta, asignarle un rol y establecer una contraseña inicial.</p>
        
        {mensajeExito && (
            <Alert
            variant="success"
            dismissible
            onClose={() => setMensajeExito('')}
            >
                {mensajeExito}
            </Alert>
        )}
         
        {mensajeError && (
            <Alert
            variant="danger"
            dismissible
            onClose={() => setMensajeError('')}
            >
            {mensajeError}
            </Alert>
        )}
         
        <Form  onSubmit={handleSubmit(onSubmit)} noValidate  > {/*noValidate para que el HTML nativo no valide ya que usamos Zod */}
            <fieldset disabled={guardandoUsuario}>
            <legend>Nuevo usuario</legend>
             
            <div className={styles.grupoCampo}>
                <label htmlFor="username"> Nombre de usuario </label>
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Nombre de usuario"
                    className={styles.campoInput}
                    aria-invalid={Boolean(errors.user)}
                    {...register('user')}
                />
                 
                {errors.user?.message && (
                    <span className={styles.error}>
                    {errors.user.message}
                    </span>
                )}
            </div>
             
            <div className={styles.grupoCampo}>
                <label htmlFor="dni"> DNI</label>
                <input
                    id="dni"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="DNI"
                    className={styles.campoInput}
                    aria-invalid={Boolean(errors.dni)}
                    {...register('dni')}
                />
                {errors.dni?.message && (
                    <span className={styles.error}>
                    {errors.dni.message}
                    </span>
                )}
            </div>
            <div className={styles.grupoCampo}>
                <label htmlFor="email"> Correo electrónico </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="usuario@correo.com"
                    className={styles.campoInput}
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                />
                 
                {errors.email?.message && (
                    <span className={styles.error}>
                    {errors.email.message}
                    </span>
                )}
            </div>
             
            <div className={styles.grupoCampo}>
                <label htmlFor="password">  Contraseña inicial </label>
                 
                <input
                    id="password"
                    type="text"
                    autoComplete="new-password"
                    placeholder="Contraseña inicial"
                    className={styles.campoInput}
                    aria-invalid={Boolean(errors.password)}
                    {...register('password')}
                />
                 
                {errors.password?.message && (
                    <span className={styles.error}>
                    {errors.password.message}
                    </span>
                )}
                 
                <small> El usuario deberá cambiar esta contraseña en su primer ingreso.</small>
            </div>
             
            <div className={styles.grupoCampo}>
                <label htmlFor="rol"> Rol del usuario </label>
                 
                <select
                    id="rol"
                    className={styles.campoInput}
                    aria-invalid={Boolean(errors.rol)}
                    {...register('rol')}
                >
                    <option value={RolUsuario.ADMIN}> Administrador </option>
                    <option value={RolUsuario.SUPERVISOR}> Supervisor </option>
                    <option value={RolUsuario.MEDICO}> Médico </option>
                    <option value={RolUsuario.RECEPCIONISTA}> Recepcionista </option>
                    <option value={RolUsuario.PACIENTE}> Paciente</option>
                </select>
                 
                {errors.rol?.message && (
                    <span className={styles.error}>
                    {errors.rol.message}
                    </span>
                )}
            </div>
  {/*           
            <Form.Check
                id="activo"
                type="switch"
                label="Usuario activo"
                className={styles.checkbox}
                {...register('activo')}
            />
             
            {errors.activo?.message && (
            <span className={styles.error}>
            {errors.activo.message}
            </span>
            )}
             
            <input
            type="hidden"
            {...register('fechaCreacion')}
            />
             
            <input
            type="hidden"
            {...register('debeCambiarPassword')}
            />
         */}    
            <Button
                type="submit"
                variant="primary"
                disabled={guardandoUsuario}
                className={styles.botonGuardar}
            >
            {guardandoUsuario ? (
                <>
                <Spinner
                    as="span"
                    size="sm"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                />{' '}
                Guardando...
                </>
            ) : (
                'Crear usuario'
            )}
            </Button>
            </fieldset>
        </Form>
         
        <hr />
         
        <section className={styles.seccionUsuarios}>
            <div className={styles.encabezadoListado}>
            <h3>Usuarios registrados</h3>
             
            <Button
            type="button"
            variant="outline-secondary"
            onClick={() => void cargarUsuarios()}
            disabled={cargandoUsuarios}
            >
            Actualizar listado
            </Button>
            </div>
             
            {cargandoUsuarios ? (
            <div className={styles.cargando}>
            <Spinner
            animation="border"
            role="status"
            />
             
            <span>Cargando usuarios...</span>
            </div>
            ) : (
            <Table striped bordered hover responsive >
            <thead>
                <tr>
                <th>Usuario</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Cambiar clave</th>
                <th>Fecha de creación</th>
                </tr>
            </thead>
             
            <tbody>
            {usuarios.length === 0 ? (
            <tr>
            <td
            colSpan={7}
            className={styles.sinUsuarios}
            >
            No existen usuarios cargados.
            </td>
            </tr>
            ) : (
            usuarios.map((usuario) => (
            <tr key={usuario._id}>
            <td>{usuario.user}</td>
             
            <td>{usuario.dni}</td>
             
            <td>{usuario.email}</td>
             
            <td>{usuario.rol}</td>
             
            <td>
            {usuario.activo
            ? 'Activo'
            : 'Inactivo'}
            </td>
             
            <td>
            {usuario.debeCambiarPassword
            ? 'Pendiente'
            : 'Actualizada'}
            </td>
             
            <td>
            {new Date(
            usuario.fechaCreacion
            ).toLocaleString('es-AR')}
            </td>
            </tr>
            ))
            )}
            </tbody>
            </Table>
            )}
        </section>
        </div>
    );
};
 
export default FormularioUsuario;