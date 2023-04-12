import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <div className='d-flex align-items-center'>
                        <img className='img-thumbnail border-0 mb-1' src={window.location.origin + `/android-chrome-512x512.png`} alt='logo-app' />
                        <div className="logo-desc mx-2 inline-block">
                            <div>Sammy's</div>
                            <div>Store</div>
                        </div>
                    </div>
                </Col>
                <Col>
                    <h6>A loja</h6>
                    <Link to='/'>Sobre nós</Link><br />
                    <Link to='/'>Contato</Link>
                </Col>
                <Col>
                    <h6>Ajuda</h6>
                    <Link to='/policies/privacy'>Politica de privacidade</Link><br />
                    <Link to='/signup'>Cadastrar</Link><br />
                    <Link to='/signin'>Login</Link>
                </Col>
                <Col>
                    <h6>Produtos</h6>
                    <Link to='/'>Seja um fornecedor</Link><br />
                    <Link to='/'>Seja um vendedor</Link><br />
                    <Link to='/'>Categorias</Link><br />
                <div className='d-flex justify-content-between w-50 mt-2'>
                    <i className="fa-brands fa-pix" style={{ color: '#4BB8A9' }}></i>&nbsp;&nbsp;
                    <i className="fab fa-cc-mastercard" style={{ color: '#ff5f00' }}></i>&nbsp;&nbsp;
                    <i className="fab fa-cc-visa" style={{ color: '#1a1f71' }}></i>&nbsp;&nbsp;
                    <i className="fas fa-barcode"></i>
                </div>
                </Col>
            </Row>
            <div className="text-center text-secondary mt-2">                
                © Sammy's Store. {new Date().getFullYear()}.
                Todos os direitos reservados | 39.752.686/0001-02
            </div>
        </Container>
    )
}
