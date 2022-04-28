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
import { userSignout } from './actions/user.actions';

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartStore.cart);
  const userInfo = useSelector((state) => state.userStore.userInfo);

  const signoutHandler = () => {
    dispatch(userSignout());
    localStorage.removeItem('userInfo');
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark">
            <Container className="d-flex justify-content-between">
              <LinkContainer to="/">
                <div className="logo-desc">
                  <div>Sammy's</div>
                  <div>Store</div>
                </div>
              </LinkContainer>
              <Nav>
                <Link to="/cart" className="nav-link">
                  <div className="cart-container">
                    <div className="circle">
                      <span className="cart-item">
                        <i className="fas fa-shopping-cart" />
                      </span>
                    </div>
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger" className="number-cart">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
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
                      <NavDropdown.Item>Histórico de pedidos</NavDropdown.Item>
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
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
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
