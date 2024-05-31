import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from 'react-router-dom';

function NavbarHome() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand style={{ fontSize: '30px' }} href="/">OnlineLino</Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand style={{ fontSize: '15px' }}>{t('navbarHome.label')}</Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar className="bg" style={{ backgroundColor: '#ffda84' }}>
                <Container>
                    <Nav className="mr-auto">
                        <Link reloadDocument to="/projeto/descricao" className="nav-link" style={{ paddingLeft: '0' }}>{t('navbarHome.project')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/biografia" className="nav-link">{t('navbarHome.biography')}</Link>
                        <span className="navbar-text">|</span>
                        <Link to="/obra" className="nav-link">{t('navbarHome.building')}</Link>
                    </Nav>
                    <Form className="ml-auto">
                        <Row>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder={t('navbarHome.search')}
                                    className="mr-sm-2"
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit">{t('navbarHome.submit')}</Button>
                            </Col>
                        </Row>
                    </Form>
                    <LanguageSwitcher />
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarHome;