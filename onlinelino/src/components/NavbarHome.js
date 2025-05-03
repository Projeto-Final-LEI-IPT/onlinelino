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
    biografia: {
        sobre: { en: 'about', pt: 'sobre' },
        iconic: { en: 'iconic', pt: 'iconic' },
    },
    obra: {
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
        } else if (section === 'biografia' || section === 'biography') {
            localizedSection = lang === 'en' ? 'biography' : 'biografia';
        } else if (section === 'obra' || section === 'building') {
            localizedSection = lang === 'en' ? 'building' : 'obra';
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
                <ul className="navbar-list">
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
                    <li className={`navbar-item ${isActive('/biografia') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(1)}>
                            {t('navbarHome.biography')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 1 ? 'show' : ''}`}>
                            <li>
                                <Link to={getLocalizedPath('/biografia')} className="dropdown-item2">
                                    {t('navbarBiography.generic')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/biografia/sobre')} className="dropdown-item2">
                                    {t('navbarBiography.about')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/biografia/iconic')} className="dropdown-item2">
                                    {t('navbarBiography.iconic')}
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={`navbar-item ${isActive('/obra') ? 'active' : ''}`}>
                        <Link className="navbar-button" onClick={() => handleDropdownToggle(2)}>
                            {t('navbarHome.building')}
                        </Link>
                        <ul className={`dropdown-menu2 ${activeDropdown === 2 ? 'show' : ''}`}>
                            <li>
                                <Link to={getLocalizedPath('/obra/detalhes')} className="dropdown-item2">
                                    {t('navbarBuilding.details')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/obra/cronologia')} className="dropdown-item2">
                                    {t('navbarBuilding.chronology')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/obra/mapa')} className="dropdown-item2">
                                    {t('navbarBuilding.map')}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLocalizedPath('/obra/lista')} className="dropdown-item2">
                                    {t('navbarBuilding.list')}
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
