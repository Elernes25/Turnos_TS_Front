import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, Button, Card, Col, Container, Form, Nav, Row, Tab, Table } from "react-bootstrap";

const RecepcionistaSchema = z.object({
  nombre: z
    .string()
    .min(3, "Ingrese un nombre válido"),
  email: z
    .email("Email inválido"),
  telefono: z
    .string()
    .min(6, "Teléfono inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres"),
});

type RecepcionistaFormData =
  z.infer<typeof RecepcionistaSchema>;

export default function DashboardSupervisor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecepcionistaFormData>({
    resolver: zodResolver(
      RecepcionistaSchema
    ),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      password: "",
    },
  });

  const onSubmit = (
    data: RecepcionistaFormData
  ) => {
    console.log(data);
    reset();
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">
        Dashboard Supervisor
      </h1>

      {/* RESUMEN GENERAL */}

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>
                Pacientes Totales
              </Card.Title>
              <h2>15.342</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>
                Médicos
              </Card.Title>
              <h2>24</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>
                Turnos Semana
              </Card.Title>
              <h2>387</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>
                Alertas
              </Card.Title>
              <h2>2</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="medicos">
        <Nav
          variant="tabs"
          className="mb-4"
        >
          <Nav.Item>
            <Nav.Link eventKey="medicos">
              Médicos
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="recepcionistas">
              Recepcionistas
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="pacientes">
              Pacientes
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="epidemiologia">
              Epidemiología
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="turnos">
              Turnos
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="especialidades">
              Especialidades
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* MÉDICOS */}

          <Tab.Pane eventKey="medicos">
            <Card>
              <Card.Body>
                <h3 className="mb-3">
                  Médicos
                </h3>

                <Form.Control
                  placeholder="Buscar médico..."
                  className="mb-4"
                />

                <Table
                  striped
                  bordered
                  hover
                >
                  <thead>
                    <tr>
                      <th>Médico</th>
                      <th>Especialidad</th>
                      <th>Pacientes</th>
                      <th>Semana</th>
                      <th>Turnos</th>
                      <th>Horas</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        Dr. Juan Pérez
                      </td>
                      <td>
                        Clínica Médica
                      </td>
                      <td>1200</td>
                      <td>34</td>
                      <td>42</td>
                      <td>21 hs</td>
                    </tr>

                    <tr>
                      <td>
                        Dra. Ana
                        González
                      </td>
                      <td>Pediatría</td>
                      <td>980</td>
                      <td>28</td>
                      <td>35</td>
                      <td>17.5 hs</td>
                    </tr>
                  </tbody>
                </Table>

                <Row className="mt-4">
                  <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          Mayor
                          disponibilidad
                        </Card.Title>

                        <h4>
                          Dra. Ana
                          González
                        </h4>

                        <p>
                          180 hs
                          disponibles
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          Más turnos
                          asignados
                        </Card.Title>

                        <h4>
                          Dr. Juan
                          Pérez
                        </h4>

                        <p>
                          42 turnos
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* RECEPCIONISTAS */}

          <Tab.Pane eventKey="recepcionistas">
            <Row>
              <Col lg={5}>
                <Card>
                  <Card.Body>
                    <h4>
                      Alta de
                      Recepcionista
                    </h4>

                    <Form
                      onSubmit={handleSubmit(
                        onSubmit
                      )}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Nombre
                        </Form.Label>

                        <Form.Control
                          {...register(
                            "nombre"
                          )}
                        />

                        <small className="text-danger">
                          {
                            errors.nombre
                              ?.message
                          }
                        </small>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Email
                        </Form.Label>

                        <Form.Control
                          {...register(
                            "email"
                          )}
                        />

                        <small className="text-danger">
                          {
                            errors.email
                              ?.message
                          }
                        </small>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Teléfono
                        </Form.Label>

                        <Form.Control
                          {...register(
                            "telefono"
                          )}
                        />

                        <small className="text-danger">
                          {
                            errors.telefono
                              ?.message
                          }
                        </small>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Contraseña
                        </Form.Label>

                        <Form.Control
                          type="password"
                          {...register(
                            "password"
                          )}
                        />

                        <small className="text-danger">
                          {
                            errors.password
                              ?.message
                          }
                        </small>
                      </Form.Group>

                      <Button
                        type="submit"
                      >
                        Crear
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={7}>
                <Card>
                  <Card.Body>
                    <h4>
                      Personal
                    </h4>

                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>
                            Nombre
                          </th>
                          <th>Email</th>
                          <th>
                            Teléfono
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>
                            María López
                          </td>
                          <td>
                            maria@mail.com
                          </td>
                          <td>
                            3777-111111
                          </td>
                        </tr>

                        <tr>
                          <td>
                            Carlos
                            Fernández
                          </td>
                          <td>
                            carlos@mail.com
                          </td>
                          <td>
                            3777-222222
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* PACIENTES */}

          <Tab.Pane eventKey="pacientes">
            <Card>
              <Card.Body>
                <h3>
                  Estadísticas de
                  Pacientes
                </h3>

                <Row className="mt-4">
                  <Col md={4}>
                    <Card>
                      <Card.Body>
                        <h2>
                          15.342
                        </h2>

                        <p>
                          Total
                          atendidos
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card>
                      <Card.Body>
                        <h2>287</h2>

                        <p>
                          Última
                          semana
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card>
                      <Card.Body>
                        <h2>1456</h2>

                        <p>
                          Último
                          mes
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* EPIDEMIOLOGÍA */}

          <Tab.Pane eventKey="epidemiologia">
            <Card>
              <Card.Body>
                <h3>
                  Vigilancia
                  Epidemiológica
                </h3>

                <Alert variant="danger">
                  Posible aumento
                  significativo de
                  casos de gripe.
                </Alert>

                <Table
                  striped
                  bordered
                >
                  <thead>
                    <tr>
                      <th>
                        Diagnóstico
                      </th>
                      <th>
                        Período
                        Anterior
                      </th>
                      <th>
                        Últimos 15
                        días
                      </th>
                      <th>
                        Variación
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Gripe</td>
                      <td>35</td>
                      <td>75</td>
                      <td>
                        +114%
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Gastroenteritis
                      </td>
                      <td>20</td>
                      <td>22</td>
                      <td>
                        +10%
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* TURNOS */}

          <Tab.Pane eventKey="turnos">
            <Row>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h2>1520</h2>
                    <p>
                      Otorgados
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h2>140</h2>
                    <p>
                      Cancelados
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h2>73</h2>
                    <p>
                      Ausentes
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h2>21</h2>
                    <p>
                      Pendientes
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* ESPECIALIDADES */}

          <Tab.Pane eventKey="especialidades">
            <Card>
              <Card.Body>
                <h3>
                  Especialidades
                  más solicitadas
                </h3>

                <Table
                  striped
                  hover
                >
                  <thead>
                    <tr>
                      <th>
                        Especialidad
                      </th>
                      <th>
                        Porcentaje
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        Clínica
                        Médica
                      </td>
                      <td>42%</td>
                    </tr>

                    <tr>
                      <td>
                        Pediatría
                      </td>
                      <td>26%</td>
                    </tr>

                    <tr>
                      <td>
                        Cardiología
                      </td>
                      <td>18%</td>
                    </tr>

                    <tr>
                      <td>
                        Odontología
                      </td>
                      <td>14%</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}