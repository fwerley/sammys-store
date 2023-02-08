import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import { toast, ToastContainer } from 'react-toastify';
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
import ProfileScreen from './screens/ProfileScreen';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './components/SearchScreen';

function App() {
  const dispatch = useDispatch();
  const { cart } = useSelector(selectCart);
  const { userInfo } = useSelector(selectUser);

  const signoutHandler = () => {
    dispatch(userSignout());
    dispatch(cartDelete());
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error))
      }
    }
    fetchCategories();
  }, [])

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen ?
            "d-flex flex-column site-container active-cont" :
            "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant='dark'
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className='fas fa-bars' />
              </Button>
              <LinkContainer to="/">
                <div className="logo-desc mx-2">
                  <div>Sammy's</div>
                  <div>Store</div>
                </div>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id='basic-navbar-nav' className='my-1'>
                <SearchBox />
                <Nav className='justify-content-end'>
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
        <div className={
          sidebarIsOpen ?
            'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column' :
            'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }
        >
          <Nav className='flex-column text-white w-100 p-2'>
            <Nav.Item>
              <strong>Categorias</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category.category}>
                <LinkContainer
                  to={{
                    pathname: 'search',
                    hash: '#hash',
                    search: `?category=${category.category}`
                  }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category.category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
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
