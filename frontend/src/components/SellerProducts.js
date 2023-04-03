import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import { fetchProducts, fetchProductsFail, fetchProductsSuccess, selectSeller } from '../slice/sellerSlice';
import Product from './Product';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export default function SellerProducts() {
  const params = useParams();
  const PAGE_SIZE = 2;
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const { id: idSeller } = params;
  const { products, loading, error } = useSelector(selectSeller);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchProducts());
      try {
        const { data } = await axios.get(`/api/sellers/${idSeller}/products`);
        setPages(Math.ceil(data.length / PAGE_SIZE))
        dispatch(fetchProductsSuccess(data));
      } catch (err) {
        dispatch(fetchProductsFail(err.message));
      }
    };
    fetchData();
  }, [dispatch, idSeller]);

  let productsPages = products.filter((product, index) => index >= ((page - 1) * PAGE_SIZE) && index < ((page - 1) * PAGE_SIZE) + PAGE_SIZE)

  return (
    <div>
      <div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {productsPages.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} xs={6} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <div className='d-flex justify-content-center'>
        {[...Array(pages).keys()].map((x) => (
          <Button
            onClick={() => setPage(x + 1)}
            className={Number(page) === x + 1 ? 'fw-bold mx-1' : 'mx-1'}
            variant="light"
          >
            {x + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
