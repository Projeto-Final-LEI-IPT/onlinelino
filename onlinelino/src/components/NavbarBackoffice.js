import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Navbar.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NavbarBackoffice = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { t } = useTranslation();
    const location = useLocation();

    const handleDropdownToggle = (index) => {
        setActiveDropdown(index);
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <>
            <nav className="navbar">
                <ul className="navbar-list">
                    <li className={`navbar-item ${isActive('/Backoffice/ProjectB') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(0)}>
                            {t('navbarHome.project')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 0 ? 'show' : ''}`}>
                            <li>
                                <Link to="/Backoffice/ProjectB/DescriptionB" className="dropdown-item2">{t('navbarProject.description')}</Link>
                            </li>
                            <li>
                                <Link to="/Backoffice/ProjectB/BibliographyB" className="dropdown-item2">{t('navbarProject.bibliography')}</Link>
                            </li>
                            <li>
                                <Link to="/Backoffice/ProjectB/TeamB" className="dropdown-item2">{t('navbarProject.team')}</Link>
                            </li>
                            <li>
                                <Link to="/Backoffice/ProjectB/ContactsB" className="dropdown-item2">{t('navbarProject.contacts')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/Backoffice/BiographyB') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(1)}>
                            {t('navbarHome.biography')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 1 ? 'show' : ''}`}>
                            <li>
                                <Link to="/Backoffice/BiographyB/GenericB" className="dropdown-item2">{t('navbarBiography.generic')}</Link>
                            </li>
                            <li>
                                <Link to="/Backoffice/BiographyB/AboutB" className="dropdown-item2">{t('navbarBiography.about')}</Link>
                            </li>
                            <li>
                                <Link to="/Backoffice/BiographyB/IconicB" className="dropdown-item2">{t('navbarBiography.iconic')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/Backoffice/BuildingB') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(2)}>
                            {t('navbarHome.building')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 2 ? 'show' : ''}`}>
                            <li>
                                <Link to="/Backoffice/BuildingB/ChronolyB" className="dropdown-item2">{t('navbarBuilding.details')}</Link>
                            </li>
                            <li>
                                <Link to="/Backoffice/BuildingB/DetailsB" className="dropdown-item2">{t('navbarBuilding.addBuild')}</Link>
                            </li>
                            
                        </ul>
                    </li>
                </ul>
                <LanguageSwitcher />
            </nav>
        
        </>
    );
};

export default NavbarBackoffice;
