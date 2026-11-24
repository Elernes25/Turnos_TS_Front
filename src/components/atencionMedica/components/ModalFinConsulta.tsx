import { Button, Modal } from 'react-bootstrap';

interface ModalFinConsultaProps {
  mostrar: boolean;
  guardando: boolean;
  puedeGuardar: boolean;
  onVolver: () => void;
  onGuardar: () => void;
}

const ModalFinConsulta = ({
  mostrar,
  guardando,
  puedeGuardar,
  onVolver,
  onGuardar,
}: ModalFinConsultaProps) => (
  <Modal show={mostrar} onHide={onVolver} centered backdrop={guardando ? 'static' : true}>
    <Modal.Header closeButton={!guardando}>
      <Modal.Title>Finalizar consulta</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      ¿Desea terminar la consulta con el paciente?
      {!puedeGuardar && (
        <p className="text-danger mt-3 mb-0">
          No se pudo identificar el turno. Volvé al dashboard e ingresá desde el turno del paciente.
        </p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" disabled={guardando} onClick={onVolver}>
        Volver a consulta
      </Button>
      <Button
        variant="primary"
        disabled={guardando || !puedeGuardar}
        onClick={onGuardar}
      >
        {guardando ? 'Guardando...' : 'Archivar o guardar consulta'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalFinConsulta;
