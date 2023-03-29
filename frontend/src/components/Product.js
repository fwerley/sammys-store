import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Rating from './Rating';
import { addCartItem, addSeller, selectCart } from '../slice/cartSlice';
import { Cart3 } from 'react-bootstrap-icons';
import { useState } from 'react';
import LoadingBox from './LoadingBox';

function Product(props) {
  const dispatch = useDispatch();
  const [addItem, setAddItem] = useState(false);
  const { product, seller } = props;
  const { cart, seller: sellerIdCart } = useSelector(selectCart);

  const addToCartHandler = async () => {
    setAddItem(true);
    const existItem = cart.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.id}`);
    if (data.countInStock < quantity) {
      window.alert('Desculpe. Quantidade insuficiente no estoque');
      setAddItem(false)
      return;
    }
    dispatch(addCartItem({ ...product, quantity }));
    sellerIdCart === '' && dispatch(addSeller(product.sellerId))
    setAddItem(false)
  };

  return (
    <Card className='h-100'>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.image} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          <div className='d-flex justify-content-around'>
            <strong>R$ {product.price},00</strong>
            {seller && (<Link to={`/seller/${product.sellerId}`}>{product.seller.name}</Link>)}
          </div>
        </Card.Text>
        <div className="d-flex justify-content-center position-absolute cart-button shadow rounded">
          {product.countInStock > 0 ? (
            <Button onClick={addToCartHandler}>
              {addItem ? <LoadingBox variant='light' /> : (<>+<Cart3 /></>)}
              {/* Add ao carrinho */}
            </Button>
          ) : (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-disabled">Item sem estoque</Tooltip>
              }
            >
              <span className="d-inline-block">
                <Button
                  disabled
                  variant="light"
                  style={{ pointerEvents: 'none' }}
                >
                  + <Cart3 />
                  {/* Add ao carrinho */}
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
