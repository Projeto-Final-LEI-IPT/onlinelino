import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Navbar.css';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';

const routeTranslations = {
    projeto: {
        descricao: { en: 'description', pt: 'descricao' },
        bibliografia: { en: 'bibliography', pt: 'bibliografia' },
        equipa: { en: 'team', pt: 'equipa' },
        contactos: { en: 'contacts', pt: 'contactos' }
    },
    carreira: {
        sobre: { en: 'materials', pt: 'materiais' },
    },
    MedioTejo: {
        detalhes: { en: 'details', pt: 'detalhes' },
        cronologia: { en: 'chronology', pt: 'cronologia' },
        mapa: { en: 'map', pt: 'mapa' },
        lista: { en: 'list', pt: 'lista' }
    }
};

const NavbarHome = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { t } = useTranslation();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleDropdownToggle = (index) => {
        setActiveDropdown(index);
    };

    const getLocalizedPath = (path) => {
        const lang = i18n.language;
        const segments = path.split('/').filter(Boolean); // remove strings vazias

        if (segments.length === 0) return '/';

        const [section, subpath] = segments;

        let localizedSection = section;
        let localizedSubpath = subpath;

        if (section === 'projeto' || section === 'project') {
            localizedSection = lang === 'en' ? 'project' : 'projeto';
        } else if (section === 'carreira' || section === 'career') {
            localizedSection = lang === 'en' ? 'career' : 'carreira';
        } else if (section === 'obra' || section === 'building') {
            localizedSection = lang === 'en' ? 'building' : 'obra';
        } else if (section === 'MedioTejo') {
            localizedSection = 'MedioTejo'; 
        }

        const subroutes = routeTranslations[section] || routeTranslations[localizedSection];
        if (subroutes && subpath && subroutes[subpath]) {
            localizedSubpath = subroutes[subpath][lang];
        }

        return `/${localizedSection}${localizedSubpath ? '/' + localizedSubpath : ''}`;
    };

    const isActive = (path) => location.pathname.includes(getLocalizedPath(path));

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
                <button className="hamburger" onClick={() => setMobileMenuOpen(prev => !prev)}>
                    ☰
                </button>
                <ul className={`navbar-list ${mobileMenuOpen ? 'show' : ''}`}>
                    <li className={`navbar-item ${isActive('/projeto') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(0)}>
                            {t('navbarHome.project')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 0 ? 'show' : ''}`}>
                            <li>
                                <Link to={getLocalizedPath('/projeto/descricao')} className="dropdown-item2">
                                    {t('navbarProject.description')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/projeto/bibliografia')} className="dropdown-item2">
                                    {t('navbarProject.bibliography')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/projeto/equipa')} className="dropdown-item2">
                                    {t('navbarProject.team')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/projeto/contactos')} className="dropdown-item2">
                                    {t('navbarProject.contacts')}
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/carreira') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(1)}>
                            {t('navbarHome.career')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 1 ? 'show' : ''}`}>
                            <li>
                                <Link to={getLocalizedPath('/carreira')} className="dropdown-item2">
                                    {t('navbarCareer.generic')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/carreira/sobre')} className="dropdown-item2">
                                    {t('navbarCareer.materials')}
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/MedioTejo') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(2)}>
                            {t('navbarHome.mediotejo')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 2 ? 'show' : ''}`}>
                            <li>
                                <Link to={getLocalizedPath('/MedioTejo/detalhes')} className="dropdown-item2">
                                    {t('navbarMedioTejo.details')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/MedioTejo/cronologia')} className="dropdown-item2">
                                    {t('navbarMedioTejo.chronology')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/MedioTejo/mapa')} className="dropdown-item2">
                                    {t('navbarMedioTejo.map')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/MedioTejo/lista')} className="dropdown-item2">
                                    {t('navbarMedioTejo.list')}
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <LanguageSwitcher />
            </nav>
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <Link to="/backoffice/login" style={{ textDecoration: "none", color:"#ffffff", padding: "10px", backgroundColor: "#155945" , borderRadius: "5px" }}>
                    {t('Login')}
                </Link>
            </div>
        </>
    );
};

export default NavbarHome;
