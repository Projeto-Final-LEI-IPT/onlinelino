import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Navbar.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NavbarHome = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { t } = useTranslation();
    const location = useLocation();

    const handleDropdownToggle = (index) => {
        setActiveDropdown(index);
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <>
            <div className="navbar-container">
                <div className="header-image">
                    <img src="../img/header.jpg" alt="Header" />
                    <a href="/">
                        <div className="logo">
                            <img src="../img/logo.png" alt="Logo" />
                        </div>
                    </a>
                </div>
            </div>
            <nav className="navbar">
                <ul className="navbar-list">
                    <li className={`navbar-item ${isActive('/projeto') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(0)}>
                            {t('navbarHome.project')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 0 ? 'show' : ''}`}>
                            <li>
                                <Link to="/projeto/descricao" className="dropdown-item2">{t('navbarProject.description')}</Link>
                            </li>
                            <li>
                                <Link to="/projeto/bibliografia" className="dropdown-item2">{t('navbarProject.bibliography')}</Link>
                            </li>
                            <li>
                                <Link to="/projeto/equipa" className="dropdown-item2">{t('navbarProject.team')}</Link>
                            </li>
                            <li>
                                <Link to="/projeto/contactos" className="dropdown-item2">{t('navbarProject.contacts')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/biografia') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(1)}>
                            {t('navbarHome.biography')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 1 ? 'show' : ''}`}>
                            <li>
                                <Link to="/biografia" className="dropdown-item2">{t('navbarBiography.generic')}</Link>
                            </li>
                            <li>
                                <Link to="/materiais" className="dropdown-item2">{t('navbarBiography.materials')}</Link>
                            </li>
                            <li>
                                <Link to="/biografia/sobre" className="dropdown-item2">{t('navbarBiography.about')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/obra') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(2)}>
                            {t('navbarHome.building')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 2 ? 'show' : ''}`}>
                            <li>
                                <Link to="/obra/detalhes" className="dropdown-item2">{t('navbarBuilding.details')}</Link>
                            </li>
                            <li>
                                <Link to="/obra/cronologia" className="dropdown-item2">{t('navbarBuilding.chronology')}</Link>
                            </li>
                            <li>
                                <Link to="/obra/mapa" className="dropdown-item2">{t('navbarBuilding.map')}</Link>
                            </li>
                            <li>
                                <Link to="/obra/lista" className="dropdown-item2">{t('navbarBuilding.list')}</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <LanguageSwitcher />
            </nav>
        </>
    );
};

export default NavbarHome;
