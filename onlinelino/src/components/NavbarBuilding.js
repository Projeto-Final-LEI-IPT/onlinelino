import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';

function NavbarBuilding() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Nav.Link href="/obra/cronologia" style={{ paddingLeft: '0' }}>{t('navbarBuilding.chronology')}</Nav.Link>
                        <span className="navbar-text">|</span>
                        <Nav.Link href="/obra/mapa">{t('navbarBuilding.map')}</Nav.Link>
                        <span className="navbar-text">|</span>
                        <Nav.Link href="/obra/lista">{t('navbarBuilding.list')}</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}


export default NavbarBuilding;