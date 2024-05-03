import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function NavbarBuilding() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Link to="/obra/cronologia" className="nav-link" style={{ paddingLeft: '0' }}>{t('navbarBuilding.chronology')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/obra/mapa" className="nav-link">{t('navbarBuilding.map')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/obra/lista" className="nav-link">{t('navbarBuilding.list')}</Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}


export default NavbarBuilding;