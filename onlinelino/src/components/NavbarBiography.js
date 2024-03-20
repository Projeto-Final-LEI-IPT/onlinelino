import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class NavbarBiography extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                    <Container>
                        <Nav className="mr-auto">
                            <Nav.Link href="/biografia" style={{ paddingLeft: '0' }}>GENÉRICA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/biografia/sobre">SOBRE O TRABALHO NO MÉDIO TEJO</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default NavbarBiography;