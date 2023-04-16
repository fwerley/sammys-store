import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Cart3, Heart } from 'react-bootstrap-icons';
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
import ScrollToTop from './components/ScrollToTop';
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
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';
import Footer from './components/Footer';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ConfirmAccountScreen from './screens/ConfirmAccountScreen';
import { UserIcon } from './components/UserIcon';
import PoliciesPrivacy from './screens/PoliciesPrivacy';
import ProductAdmin from './screens/Admin/ProductAdmin';

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
  const [width, setWidth] = useState(window.innerWidth);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  // const [categories, setCategories] = useState([]);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  const eventCollapse = (param) => {
    if (width <= 995) {
      setNavbarExpanded(param);
    }
  }

  useEffect(() => {
    // Se width for menor que 768, o dispositivo é mobile
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

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
      <ScrollToTop />
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
        <header className='shadow-sm mb-3'>
          <Navbar collapseOnSelect expanded={navbarExpanded} bg="light" variant="light" expand="lg">
            <Container>
              <Button
                variant='ligth'
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className='fas fa-bars' />
              </Button>
              <LinkContainer to="/" onClick={() => eventCollapse(false)}>
                <div className="logo-desc mx-2">
                  <div>Sammy's</div>
                  <div>Store</div>
                </div>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => eventCollapse(!navbarExpanded)} />
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox eventCollapse={eventCollapse} />
                <Nav className='justify-content-end'>
                  <Link to="/cart" className="nav-link" onClick={() => eventCollapse(false)}>
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
                  {/* <Link to="/favorites" className="nav-link" onClick={() => eventCollapse(false)}>
                    <div className="circle">
                      <Heart />
                    </div>
                    <span style={{ display: 'none' }}>
                      &nbsp;Meus desejos
                    </span>
                  </Link> */}
                  {userInfo ? (
                    <NavDropdown
                      title={<UserIcon />}
                      id="basic-nav-dropdown"
                      drop={width <= 768 ? 'end' : 'start'}
                      onSelect={() => eventCollapse(false)}
                    >
                      <NavDropdown.Item disabled>{userInfo.name}</NavDropdown.Item>
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
                    <NavDropdown
                      title="Vendedor"
                      id="admin-nav-dropdown"
                      onSelect={() => eventCollapse(false)}
                    >
                      <LinkContainer to="/seller/products">
                        <NavDropdown.Item>Produtos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/seller/orders">
                        <NavDropdown.Item>Pedidos</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title="Admin"
                      id="admin-nav-dropdown"
                      onSelect={() => eventCollapse(false)}
                    >
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
                      <LinkContainer to="/admin/support">
                        <NavDropdown.Item>Suporte</NavDropdown.Item>
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
          <Container>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/seller/:id" element={<SellerScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/confirm-account/:token" element={<ConfirmAccountScreen />} />
              <Route path="/forget-password" element={<ForgetPasswordScreen />} />
              <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/policies/privacy" element={<PoliciesPrivacy />} />
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
              <Route path='/admin/support' element={
                <AdminRoute>
                  <SupportScreen />
                </AdminRoute>} />
              <Route path='/admin/products' element={
                <AdminRoute>
                  {/* <ProductListScreen /> */}
                  <ProductAdmin />
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
        <footer className='bg-light p-4 mt-5'>
          <Footer />
          {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
