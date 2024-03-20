import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class NavbarBuilding extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                    <Container>
                        <Nav className="mr-auto">
                            <Nav.Link href="/obra/cronologia" style={{ paddingLeft: '0' }}>CRONOLOGIA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/obra/mapa">MAPA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/obra/lista">LISTA</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default NavbarBuilding;