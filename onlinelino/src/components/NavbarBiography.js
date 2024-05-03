import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function NavbarBiography() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Link to="/biografia" className="nav-link" style={{ paddingLeft: '0' }}>{t('navbarBiography.generic')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/biografia/sobre" className="nav-link">{t('navbarBiography.about')}</Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarBiography;