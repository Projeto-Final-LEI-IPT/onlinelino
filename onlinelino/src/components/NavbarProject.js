import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function NavbarProject() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg" style={{ backgroundColor: '#fff6db' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Link to="/projeto/descricao" className="nav-link" style={{ paddingLeft: '0' }}>{t('navbarProject.description')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/projeto/bibliografia" className="nav-link">{t('navbarProject.bibliography')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/projeto/equipa" className="nav-link">{t('navbarProject.team')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/projeto/contactos" className="nav-link">{t('navbarProject.contacts')}</Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}


export default NavbarProject;