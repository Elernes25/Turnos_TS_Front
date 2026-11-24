import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import { PersonPlus } from 'react-bootstrap-icons';
import { useFetch } from '../../hooks/useFetch';
import type { IPaciente } from '../../types/Paciente.type';
import PacienteExistente from './components/PacienteExistente';
import PacienteNuevo from './components/PacienteNuevo';
import styles from './Paciente.module.scss';

const normalizar = (texto: string): string =>
    texto.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();

const Paciente = () => {
    const navigate = useNavigate();
    const {
        data: pacientesData,
        isLoading: cargandoPacientes,
        refetch: actualizarPacientes,
    } = useFetch<IPaciente[]>('/pacientes');
    const [busqueda, setBusqueda] = useState('');
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState<IPaciente | null>(null);
    const [mostrarPacienteNuevo, setMostrarPacienteNuevo] = useState(false);

    const resultadosBusqueda = useMemo(() => {
        const termino = normalizar(busqueda);
        if (!termino || !pacientesData) return [];

        return pacientesData.filter((paciente) =>
            normalizar(paciente.nombre).includes(termino)
            || normalizar(paciente.dni).includes(termino),
        ).slice(0, 8);
    }, [busqueda, pacientesData]);

    const errorCargaPacientes = !cargandoPacientes && pacientesData === null;

    const iniciarNuevoPaciente = (): void => {
        setPacienteSeleccionado(null);
        setMostrarPacienteNuevo(true);
    };

    const completarNuevoPaciente = (): void => {
        void actualizarPacientes();
        setMostrarPacienteNuevo(false);
        setPacienteSeleccionado(null);
        setBusqueda('');
    };

    const seleccionarPaciente = (paciente: IPaciente): void => {
        setMostrarPacienteNuevo(false);
        setPacienteSeleccionado(paciente);
        setBusqueda(`${paciente.nombre} · DNI ${paciente.dni}`);
    };

    const cancelarNuevoPaciente = (): void => {
        setMostrarPacienteNuevo(false);
    };

    const cambiarPaciente = (): void => {
        setPacienteSeleccionado(null);
        setBusqueda('');
    };

    return (
        <main className={styles.contenedor}>
            <header className={styles.encabezado}>
                <h1>Ingreso de paciente y turno</h1>
                <Button
                    type="button"
                    onClick={iniciarNuevoPaciente}
                    disabled={cargandoPacientes || errorCargaPacientes || mostrarPacienteNuevo}
                >
                    <PersonPlus aria-hidden="true" className="me-1" />
                    Nuevo Paciente
                </Button>
            </header>

            {mostrarPacienteNuevo ? (
                <PacienteNuevo
                    initialDni={/^\d{7,8}$/.test(busqueda.trim()) ? busqueda.trim() : ''}
                    onCancelar={cancelarNuevoPaciente}
                    onCompletado={completarNuevoPaciente}
                />
            ) : (
                <>
                    <section className={styles.bloqueBusqueda} aria-labelledby="buscar-paciente-label">
                        <Form.Group controlId="buscarPaciente">
                            <Form.Label id="buscar-paciente-label">
                                Buscar paciente por Nombre o DNI:
                            </Form.Label>
                            <Form.Control
                                type="search"
                                value={busqueda}
                                onChange={(evento) => {
                                    setPacienteSeleccionado(null);
                                    setBusqueda(evento.target.value);
                                }}
                                placeholder="Ingresá nombre o DNI"
                                disabled={cargandoPacientes || errorCargaPacientes}
                            />
                            <Form.Text className="text-body-secondary">
                                {cargandoPacientes
                                    ? 'Cargando pacientes...'
                                    : 'Escribí para buscar y seleccioná el paciente en los resultados.'}
                            </Form.Text>
                        </Form.Group>
                    </section>

                    {errorCargaPacientes && (
                        <Alert variant="danger" className="mt-3">
                            No se pudo consultar el listado de pacientes. No es posible verificar si el paciente ya existe.
                        </Alert>
                    )}

                    {!pacienteSeleccionado && resultadosBusqueda.length > 0 && (
                        <div className={styles.resultados} aria-label="Resultados de búsqueda de pacientes">
                            {resultadosBusqueda.map((paciente) => (
                                <button
                                    key={paciente.id}
                                    type="button"
                                    className={styles.resultado}
                                    onClick={() => seleccionarPaciente(paciente)}
                                >
                                    <strong>{paciente.nombre}</strong>
                                    <span className="ms-2">DNI {paciente.dni}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {!pacienteSeleccionado
                        && busqueda.trim()
                        && !cargandoPacientes
                        && pacientesData !== null
                        && resultadosBusqueda.length === 0 && (
                            <Alert variant="info" className="mt-3">
                                No se encontraron pacientes con esos datos. Podés usar «Nuevo Paciente».
                            </Alert>
                        )}

                    {pacienteSeleccionado && (
                        <PacienteExistente
                            paciente={pacienteSeleccionado}
                            onCambiarPaciente={cambiarPaciente}
                            onCargarTurno={() => navigate(
                                `/nuevo-turno/${encodeURIComponent(pacienteSeleccionado.id)}`,
                            )}
                        />
                    )}
                </>
            )}
        </main>
    );
};

export default Paciente;
