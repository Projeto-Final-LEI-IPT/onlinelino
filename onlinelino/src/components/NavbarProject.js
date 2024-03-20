import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
                            <Nav.Link href="/projeto/descricao" style={{ paddingLeft: '0' }}>DESCRIÇÃO</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/projeto/bibliografia">BIBLIOGRAFIA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/projeto/equipa">EQUIPA</Nav.Link>
                            <span className="navbar-text">|</span>
                            <Nav.Link href="/projeto/contactos">CONTACTOS</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default NavbarProject;