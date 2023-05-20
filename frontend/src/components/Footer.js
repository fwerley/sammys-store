import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <Container>
            <Row>
                <Col md={4} sm={12} xs={12} className='d-flex logo-social-container'>
                    <div className='d-flex align-items-center'>
                        <img className='img-thumbnail border-0 mb-1' src={window.location.origin + `/android-chrome-512x512.png`} alt='logo-app' />
                        <div className="logo-desc mx-2 inline-block" style={{ fontSize: '18px' }}>
                            <div>Sammy's</div>
                            <div>Store</div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-evenly w-50 my-2 link-social-media' style={{ fontSize: '1.4rem' }}>
                        <Link to='https://www.facebook.com/Sammys-Store-108620648898716' target='_blank'>
                            <i className="fa-brands fa-square-facebook"></i>
                        </Link>
                        <Link to='https://www.instagram.com/sammy_s.store/' target='_blank'>
                            <i className="fa-brands fa-instagram"></i>
                        </Link>
                    </div>
                </Col>
                <Col>
                    <h5>A loja</h5>
                    <Link to='/about'>Sobre nós</Link><br />
                    <Link to='/contact'>Contato</Link>
                </Col>
                <Col>
                    <h5>Ajuda</h5>
                    <Link to='/policies/privacy'>Politica de privacidade</Link><br />
                    <Link to='/signup'>Cadastrar</Link><br />
                    <Link to='/signin'>Login</Link>
                </Col>
                <Col>
                    <h5>Produtos</h5>
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
