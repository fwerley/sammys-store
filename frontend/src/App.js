import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Cart3 } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';

import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import OrderScreen from './screens/OrderScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';

import { fetchCategories, selectProducts } from './slice/productsSlice';
import { selectUser, userSignout } from './slice/userSlice';
import { selectCart, cartDelete } from './slice/cartSlice';
import { useEffect, useState } from 'react';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './components/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './components/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import AdminRoute from './components/AdminRoute';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';

function App() {
  const dispatch = useDispatch();
  const { cart } = useSelector(selectCart);
  const { userInfo, fullBox } = useSelector(selectUser);
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
          // sidebarIsOpen
          // ? fullBox
          //  ? "d-flex flex-column site-container active-cont full-box" 
          //  : "d-flex flex-column site-container active-cont" :
          fullBox ?
            "d-flex flex-column site-container full-box"
            : "d-flex flex-column site-container"
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
                        <span className="cart-item text-center">
                          {/* <i className="fas fa-shopping-cart" /> */}
                          <Cart3 />
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
                  {userInfo && userInfo.isSeller && (
                    <NavDropdown title="Vendedor" id="admin-nav-dropdown">
                      <LinkContainer to="/seller/products">
                        <NavDropdown.Item>Produtos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/seller/orders">
                        <NavDropdown.Item>Pedidos</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
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
              <Route path="/seller/:id" element={<SellerScreen />} />
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
              <Route path="/map" element={
                <ProtectedRoute>
                  <MapScreen />
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
              <Route path='/admin/users' element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>} />
              <Route path='/admin/products' element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>} />
              <Route path='/admin/product/:id' element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>} />
              <Route path='/admin/user/:id' element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>} />
              {/* Seller Routes */}
              <Route path='/seller/products' element={
                <SellerRoute>
                  <ProductListScreen />
                </SellerRoute>} />
              <Route path='/seller/order/:id' element={
                <SellerRoute>
                  <OrderScreen />
                </SellerRoute>} />
              <Route path='/seller/orders' element={
                <SellerRoute>
                  <OrderListScreen />
                </SellerRoute>} />
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
