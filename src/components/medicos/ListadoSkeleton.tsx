import { ListGroup, Placeholder } from "react-bootstrap";

const ListadoSkeleton = () => {
  return (
    <ListGroup>
      {[...Array(5)].map((_, index) => (
        <ListGroup.Item key={index}>
          <Placeholder as="span" animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ListadoSkeleton;