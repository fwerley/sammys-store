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
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './components/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import { fetchCategories, selectProducts } from './slice/productsSlice';
import TreeViewMenu from './components/TreeViewMenu';

function App() {
  const dispatch = useDispatch();
  const { cart } = useSelector(selectCart);
  const { userInfo } = useSelector(selectUser);
  const { categories } = useSelector(selectProducts);

  const signoutHandler = () => {
    dispatch(userSignout());
    dispatch(cartDelete());
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  // const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        dispatch(fetchCategories(data))
      } catch (error) {
        toast.error(getError(error))
      }
    }
    if (categories.length === 0) {
      fetchData();
    }
  }, [categories, dispatch])

  return (
    <BrowserRouter>
      <div
        className={
          // sidebarIsOpen ?
          //   "d-flex flex-column site-container active-cont" :
          "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header className='shadow-sm'>
          <Navbar bg="light" variant="light" expand="lg">
            <Container>
              <Button
                variant='ligth'
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
              <Navbar.Collapse id='basic-navbar-nav'>
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
                    <span style={{ display: 'none' }}>
                      Meu Carrinho
                    </span>
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
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Produtos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Pedidos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Usuários</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
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
        }>
          <Nav className='flex-column w-100 p-2'>
            <Nav.Item>
              <div className='d-flex justify-content-between align-items-center'>
                <strong>Departamentos</strong>
                <Button
                  onClick={() => setSidebarIsOpen(false)}
                  variant='light'
                >
                  <i className="fas fa-times-circle" />
                </Button>
              </div>
            </Nav.Item>
            {/* TreeView */}
            <TreeViewMenu />
            {categories.map((category) => (
              <Nav.Item key={category.category}>
                <LinkContainer
                  to={{
                    pathname: '/search',
                    search: `category=${category.category}`
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
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>} />
              <Route path="/orderhistory" element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path='/admin/dashboard' element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>} />
              <Route path='/admin/orders' element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>} />
              <Route path='/admin/products' element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>} />
              <Route path='/admin/product/:id' element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>} />
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
