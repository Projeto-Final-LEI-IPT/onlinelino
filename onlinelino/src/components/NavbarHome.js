import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class NavbarHome extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand style={{ fontSize: '30px' }} href="/">OnlineLino</Navbar.Brand>
                    </Container>
                </Navbar>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand style={{ fontSize: '15px' }}>Raul Lino no Médio Tejo</Navbar.Brand>
                    </Container>
                </Navbar>
                <Navbar className="bg" style={{ backgroundColor: '#ffda84' }}>
                    <Container>
                        <Nav className="mr-auto">
                            <Nav.Link href="/projeto/descricao" style={{ paddingLeft: '0' }}>PROJETO</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/biografia">BIOGRAFIA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/obra">OBRA</Nav.Link>
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

export default NavbarHome;