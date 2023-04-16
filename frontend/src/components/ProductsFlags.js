import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

export default function ProductsFlags() {
    return (
        <div>
            <form onSubmit={''}>
                <Row>
                    <Col>
                        <h4>Slides</h4>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Nome</Form.Label>
                            <InputGroup.Text id="basic-addon3">
                                Link slide 1
                            </InputGroup.Text>
                            <Form.Control
                                // value={name}
                                // onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                // value={email}
                                // onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </form>
        </div>
    )
}
