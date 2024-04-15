import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';

function NavbarProject() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Nav.Link href="/projeto/descricao" style={{ paddingLeft: '0' }}>{t('navbarProject.description')}</Nav.Link>
                        <span className="navbar-text">|</span>
                        <Nav.Link href="/projeto/bibliografia">{t('navbarProject.bibliography')}</Nav.Link>
                        <span className="navbar-text">|</span>
                        <Nav.Link href="/projeto/equipa">{t('navbarProject.team')}</Nav.Link>
                        <span className="navbar-text">|</span>
                        <Nav.Link href="/projeto/contactos">{t('navbarProject.contacts')}</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}


export default NavbarProject;