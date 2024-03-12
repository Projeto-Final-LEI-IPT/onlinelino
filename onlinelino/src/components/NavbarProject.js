import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class NavbarProject extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                    <Container>
                        <Nav className="mr-auto">
                            <Nav.Link href="/project" style={{ paddingLeft: '0' }}>CRONOLOGIA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/project/map">MAPA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="#biografia">BIBLIOGRAFIA</Nav.Link>
                        </Nav>
                        <Form inline className="ml-auto">
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        className="mr-sm-2"
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit">Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default NavbarProject;