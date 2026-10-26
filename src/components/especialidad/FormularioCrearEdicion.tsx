import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { clientesAxios } from '../../config/axios';

// 🔹 Definimos la interfaz para los datos
interface Especialidad {
  id: string;          // o number, según tu backend
  nombre: string;
  descripcion?: string; // puede ser opcional
}

// 🔹 Definimos las props del componente
interface ModalEspecialidadProps {
  show: boolean;                 // controla visibilidad del modal
  onHide: () => void;            // función para cerrar modal
  datos?: Especialidad | null;   // datos a editar, opcional
}


const ModalEspecialidad = ({ show, onHide, datos }: ModalEspecialidadProps) => {
  const [nombre, setNombre] = useState(datos?.nombre || "");
  const [descripcion, setDescripcion] = useState(datos?.descripcion || "");

  const handleGuardar = async () => {
    if (datos) {
      await clientesAxios.put(`/especialidad/${datos.id}`, { nombre, descripcion });
    } else {
      await clientesAxios.post(`/especialidad`, { nombre, descripcion });
    }
    onHide();
  };

 
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{datos ? "Editar Especialidad" : "Nueva Especialidad"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEspecialidad;

/* TODO: Zod + React Hook Form
// 1 - Definir un schema con Zod para validar los campos (nombre, descripcion).
// 2 - Usar useForm con zodResolver para conectar el schema.
// 3 - Tipar el DTO con z.infer<typeof Schema> para que el formulario esté alineado con TypeScript.

import { Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clientesAxios } from "../../config/axios";

// 🔹 Definimos el esquema con Zod
const especialidadSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
});

// 🔹 Inferimos el tipo DTO
type EspecialidadDTO = z.input<typeof especialidadSchema>;

/// YA ESTAN DEFINIDOS EN src/types/Especialidad.type.ts ///

const ModalEspecialidad: React.FC<ModalEspecialidadProps> = ({ show, onHide, datos }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EspecialidadDTO>({
    resolver: zodResolver(especialidadSchema),
    defaultValues: {
      nombre: datos?.nombre || "",
      descripcion: datos?.descripcion || "",
    },
  });

  // 🔹 Reset cuando cambian los datos (ej. abrir modal con otra especialidad)
  React.useEffect(() => {
    reset({
      nombre: datos?.nombre || "",
      descripcion: datos?.descripcion || "",
    });
  }, [datos, reset]);

  const onSubmit = async (formData: EspecialidadDTO) => {
    if (datos) {
      await clientesAxios.put(`/especialidad/${datos.id}`, formData);
    } else {
      await clientesAxios.post(`/especialidad`, formData);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{datos ? "Editar Especialidad" : "Nueva Especialidad"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" {...register("nombre")} />
            {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={2} {...register("descripcion")} />
            {errors.descripcion && <span className="text-danger">{errors.descripcion.message}</span>}
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEspecialidad;
*/