import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';

function NavbarBiography() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Nav.Link href="/biografia" style={{ paddingLeft: '0' }}>{t('navbarBiography.generic')}</Nav.Link>
                        <span className="navbar-text">|</span>
                        <Nav.Link href="/biografia/sobre">{t('navbarBiography.about')}</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarBiography;