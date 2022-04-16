import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Rating from './Rating';
import { addCartItem } from '../actions/cart.actions';

function Product(props) {
  const dispatch = useDispatch();
  const { product } = props;

  const addToCartHandler = () => {
    dispatch(addCartItem({ ...product, quantity: 1 }));
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.image} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          <strong>R$ {product.price},00</strong>
        </Card.Text>
        <div className="d-flex justify-content-center">
          {product.countInStock > 0 ? (
            <Button onClick={addToCartHandler}>Add ao carrinho</Button>
          ) : (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-disabled">Item sem estoque</Tooltip>
              }
            >
              <span className="d-inline-block">
                <Button disabled style={{ pointerEvents: 'none' }}>
                  Add ao carrinho
                </Button>
              </span>
            </OverlayTrigger>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
