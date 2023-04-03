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
                    <Link to='/'>Cadastrar</Link><br />
                    <Link to='/'>Login</Link>
                </Col>
                <Col>
                    <h6>Produtos</h6>
                    <Link to='/'>Seja um fornecedor</Link><br />
                    <Link to='/'>Seja um vendedor</Link><br />
                    <Link to='/'>Categorias</Link><br />
                </Col>
            </Row>
        </Container>
    )
}
