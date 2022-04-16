import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

function App() {
  const cart = useSelector((state) => state.cartStore.cart);
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container className="d-flex justify-content-around">
              <LinkContainer to="/">
                <div className="logo-desc">
                  <div>Sammy's</div>
                  <div>Store</div>
                </div>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  <div className="circle">
                    <span className="cart-item">
                      <i className="fas fa-shopping-cart" />
                    </span>
                  </div>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger" className="number-cart">
                      {cart.cartItems.length}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">Todos os direitos reservados (c)</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
