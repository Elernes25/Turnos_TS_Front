// medicos/EditarMedico.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';

import { clientesAxios } from '../../../config/axios';
import { medicoDetalleSchema, type IcrearMedicoDTO, } from '../../../types/Medico.type';

import { obtenerMensajeError } from '../../utils/obtenerMensajeError';
import FormularioMedico from './../FormularioMedico';

const EditarMedico = () => {
  const { id } = useParams<{ id: string }>();

  const [medico, setMedico] = useState<IcrearMedicoDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelado = false;

    const cargarMedico = async (): Promise<void> => {
      try {
        const { data } = await clientesAxios.get(`/medicos/${id}`);

        const medicoDetalle = medicoDetalleSchema.parse(data.datos);

        const medicoFormulario: IcrearMedicoDTO = {
          ...medicoDetalle,
          especialidad: medicoDetalle.especialidad.map((esp) => esp.id),
        };

        if (!cancelado) {
          setMedico(medicoFormulario);
        }
      } catch (error: unknown) {
        if (!cancelado) {
          setError(obtenerMensajeError(error));
        }
      }
    };

    void cargarMedico();

    return () => {
      cancelado = true;
    };
  }, [id]);

  if (!id) {
    return (
      <Alert variant="danger">
        Identificador de médico no válido.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (!medico) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">
            Cargando médico...
          </span>
        </Spinner>
      </div>
    );
  }

  return (
    <FormularioMedico
      key={id}
      medicoId={id}
      valoresIniciales={medico}
    />
  );
};

export default EditarMedico;