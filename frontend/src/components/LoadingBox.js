import Spinner from 'react-bootstrap/Spinner';

function LoadingBox({ variant }) {
  return (
    <Spinner animation="border" role="status" variant={variant ? variant : "primary"}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default LoadingBox;
