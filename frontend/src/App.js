import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <div className="logo-desc">
                  <div>Sammy's</div>
                  <div>Store</div>
                </div>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
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
