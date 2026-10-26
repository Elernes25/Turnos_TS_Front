import { useFieldArray, UseFieldArrayAppend, UseFieldArrayRemove, Control, UseFormRegister } from "react-hook-form";
import { Form, Card, Button, InputGroup } from 'react-bootstrap';
import { DiaSemana } from "../../../types/Agenda.types";
import type { ICrearAgendaMedicoDTO } from "../../../types/Agenda.types";

interface DiaItemProps {
  nombreDia: DiaSemana; // Obligamos a que coincida con tu Enum tipado
  isActivo: boolean;
  indexEnArray: number;
  appendDia: UseFieldArrayAppend<ICrearAgendaMedicoDTO, "dias">;
  removeDia: UseFieldArrayRemove;
  control: Control<ICrearAgendaMedicoDTO>;
  register: UseFormRegister<ICrearAgendaMedicoDTO>;
}

const DiaItem = ({  nombreDia,  isActivo,  indexEnArray,  appendDia,  removeDia,  control,  register }: DiaItemProps) => {


  const rutaRangos = (isActivo && indexEnArray >= 0) 
  ? `dias.${indexEnArray}.rangos` 
  : "dias.dummy";
  // Declaramos el useFieldArray interno para los rangos de ESTE día específico
  const { fields, append, remove } = useFieldArray({
    control,
    // Si el día está activo en el array principal, apuntamos a su índice ("dias.0.rangos"), 
    // si no está activo, usamos una ruta fallback segura ("dias.0.rangos") para evitar errores
    //name: isActivo ? `dias.${indexEnArray}.rangos` : "dias.0.rangos",
    //name: isActivo && indexEnArray !== -1 ? `dias.${indexEnArray}.rangos` : "dias.dummy" as any
    name: rutaRangos as any,
  });

  // Manejamos manualmente qué pasa cuando el médico tilda/destilda el día
  const manejarCambioCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Si se marca: Añadimos un objeto NUEVO con la estructura completa que Zod espera
       console.log ("DIA seleccionado-----****>",nombreDia);
       console.log ("array DIAS -----****>",);
      appendDia({
        diaSemana: nombreDia,
        // Inicializamos de una vez con un rango para evitar el error 'too_small' de Zod
        rangos: [{ horaInicio: '08:00', horaFin: '12:00' }] 
      });
    } else {
      // Si se desmarca: Buscamos si existe en el array y lo quitamos por completo
      if (indexEnArray !== -1) {
        removeDia(indexEnArray);
        console.log ("DIA removido-----****>",nombreDia);
      }
    }
  };

  return (
    <Card className="bg-light">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between">
          <Form.Check
            type="checkbox"
            id={`dia-activo-${nombreDia}`}
            label={<span className="fw-semibold">{nombreDia}</span>}
            // Controlamos de forma limpia el check usando el booleano 'isActivo' calculado en el padre
            checked={isActivo}
            onChange={manejarCambioCheckbox}
          />

          {isActivo && (
            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              onClick={() => append({ horaInicio: '08:00', horaFin: '12:00' })}
            >
              + Agregar Rango Horario
            </Button>
          )}
        </div>

        {/* Renderizamos la sección de horas únicamente si el día fue añadido al array final */}
        {isActivo && indexEnArray !== -1 && (
          <div className="d-flex flex-column gap-2 mt-3 ps-4">
            {fields.map((field, rIndex) => (
              <div key={field.id} className="d-flex align-items-center flex-wrap gap-2">
                <small className="text-muted fw-medium">Rango {rIndex + 1}:</small>
                
                <InputGroup size="sm" style={{ width: 'auto' }}>
                  {/* REFACTORIZADO: Ahora apuntan dinámicamente al 'indexEnArray' en vez del index del enum */}
                  <Form.Control
                    type="time"
                    aria-label={`Hora de inicio del rango ${rIndex + 1}`}
                    {...register(`dias.${indexEnArray}.rangos.${rIndex}.horaInicio`)}
                  />
                  <InputGroup.Text>a</InputGroup.Text>
                  <Form.Control
                    type="time"
                    aria-label={`Hora de fin del rango ${rIndex + 1}`}
                    {...register(`dias.${indexEnArray}.rangos.${rIndex}.horaFin`)}
                  />
                </InputGroup>

                {/* No dejamos vaciar por completo el array para evitar el error 'too_small' */}
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-danger fw-bold text-decoration-none"
                    aria-label={`Quitar rango ${rIndex + 1}`}
                    onClick={() => remove(rIndex)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DiaItem;