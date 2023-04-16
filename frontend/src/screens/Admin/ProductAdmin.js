import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductListScreen from '../ProductListScreen'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'
import ProductsFlags from '../../components/ProductsFlags'

export default function ProductAdmin() {
    return (
        <>
            <h2>Admin | Produtos</h2>
            <Row className='my-4' >
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">
                                    <i className="fa-solid fa-list"> </i>&nbsp;
                                    Cadastrados
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">
                                    <i class="fa-regular fa-flag"></i>&nbsp;
                                    Banners
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <ProductListScreen />
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <ProductsFlags />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Tab.Container>
            </Row>
        </>
    )
}
