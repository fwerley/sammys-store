import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';

import { selectUser, userSignout } from './slice/userSlice';
import { selectCart, cartDelete } from './slice/cartSlice';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

function App() {
  const dispatch = useDispatch();
  const { cart } = useSelector(selectCart);
  const { userInfo } = useSelector(selectUser);

  const signoutHandler = () => {
    dispatch(userSignout());
    dispatch(cartDelete());
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <div className="logo-desc">
                  <div>Sammy's</div>
                  <div>Store</div>
                </div>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='me-auto w-100 justify-content-end'>
                <Link to="/cart" className="nav-link">
                  <div className="cart-container">
                    <div className="circle">
                      <span className="cart-item">
                        <i className="fas fa-shopping-cart" />
                      </span>
                    </div>
                    {cart.length > 0 && (
                      <Badge pill bg="danger" className="number-cart">
                        {cart.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </div>
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Meus dados</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Meus pedidos</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sair
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link to="/signin" className="nav-link">
                    Login
                  </Link>
                )}
              </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
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
