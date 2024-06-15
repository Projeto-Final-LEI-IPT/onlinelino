import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Navbar.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NavbarHome = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        // Check the current path to set the active dropdown on initial render or path change
        const path = location.pathname;

        // if (path.startsWith('/obra')) {
        //     setActiveDropdown(2);
        // }
    }, [location]);

    const handleDropdownToggle = (index) => {
        setActiveDropdown(index);
    };

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
                    <li className="navbar-item">
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(0)}>
                            {t('navbarHome.project')}
                        </Link>
                        <ul className={`dropdown-menu ${activeDropdown === 0 ? 'show' : ''}`}>
                            <li>
                                <Link to="/projeto/descricao" className="dropdown-item">{t('navbarProject.description')}</Link>
                            </li>
                            <li>
                                <Link to="/projeto/bibliografia" className="dropdown-item">{t('navbarProject.bibliography')}</Link>
                            </li>
                            <li>
                                <Link to="/projeto/equipa" className="dropdown-item">{t('navbarProject.team')}</Link>
                            </li>
                            <li>
                                <Link to="/projeto/contactos" className="dropdown-item">{t('navbarProject.contacts')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="navbar-item">
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(1)}
                        >
                            {t('navbarHome.biography')}
                        </Link>
                        <ul className={`dropdown-menu ${activeDropdown === 1 ? 'show' : ''}`}>
                            <li>
                                <Link to="/biografia" className="dropdown-item">{t('navbarBiography.generic')}</Link>
                            </li>
                            <li>
                                <Link to="/biografia/sobre" className="dropdown-item">{t('navbarBiography.about')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="navbar-item">
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(2)}>
                            {t('navbarHome.building')}
                        </Link>
                        <ul className={`dropdown-menu ${activeDropdown === 2 ? 'show' : ''}`}>
                            <li>
                                <Link to="/obra/detalhes" className="dropdown-item">{t('navbarBuilding.details')}</Link>
                            </li>
                            <li>
                                <Link to="/obra/cronologia" className="dropdown-item">{t('navbarBuilding.chronology')}</Link>
                            </li>
                            <li>
                                <Link to="/obra/mapa" className="dropdown-item">{t('navbarBuilding.map')}</Link>
                            </li>
                            <li>
                                <Link to="/obra/lista" className="dropdown-item">{t('navbarBuilding.list')}</Link>
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
