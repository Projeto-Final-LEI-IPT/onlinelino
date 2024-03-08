import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

class NavbarHome extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand style={{ fontSize: '30px' }} href="#home">OnlineLino</Navbar.Brand>
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
                            <Nav.Link href="#projeto" style={{ paddingLeft: '0' }}>PROJETO</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="#equipa">EQUIPA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="#biografia">BIOGRAFIA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="#contactos">CONTACTOS</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default NavbarHome;