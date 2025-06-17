import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NavbarBackoffice = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // novo estado para mobile
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const isActive = (path) => location.pathname.includes(path);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null); // opcional: fecha dropdowns ao abrir/fechar o menu
  };

  return (
    <nav className="navbar">
      {/* Botão Hamburguer */}
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      {/* Lista de links */}
      <ul className={`navbar-list ${menuOpen ? 'show' : ''}`}>
        {/* Project Dropdown */}
        <li className={`navbar-item ${isActive('/Backoffice/ProjectB') ? 'active' : ''}`}>
          <button className="navbar-button" onClick={() => handleDropdownToggle(0)}>
            {t('navbarHome.project')}
          </button>
          <ul className={`dropdown-menu2 ${activeDropdown === 0 ? 'show' : ''}`}>
            <li><Link to="/Backoffice/ProjectB/DescriptionB" className="dropdown-item2">{t('navbarProject.description')}</Link></li>
            <li><Link to="/Backoffice/ProjectB/BibliographyB" className="dropdown-item2">{t('navbarProject.bibliography')}</Link></li>
            <li><Link to="/Backoffice/ProjectB/TeamB" className="dropdown-item2">{t('navbarProject.team')}</Link></li>
            <li><Link to="/Backoffice/ProjectB/ContactsB" className="dropdown-item2">{t('navbarProject.contacts')}</Link></li>
          </ul>
        </li>

        {/* Career Dropdown */}
        <li className={`navbar-item ${isActive('/Backoffice/CareerB') ? 'active' : ''}`}>
          <button className="navbar-button" onClick={() => handleDropdownToggle(1)}>
            {t('navbarHome.career')}
          </button>
          <ul className={`dropdown-menu2 ${activeDropdown === 1 ? 'show' : ''}`}>
            <li><Link to="/Backoffice/CareerB/GenericB" className="dropdown-item2">{t('navbarCareer.generic')}</Link></li>
            <li><Link to="/Backoffice/CareerB/MaterialsB" className="dropdown-item2">{t('navbarCareer.materials')}</Link></li>
          </ul>
        </li>

        {/* Medio Tejo Dropdown */}
        <li className={`navbar-item ${isActive('/Backoffice/MedioTejoB') ? 'active' : ''}`}>
          <button className="navbar-button" onClick={() => handleDropdownToggle(2)}>
            {t('navbarHome.mediotejo')}
          </button>
          <ul className={`dropdown-menu2 ${activeDropdown === 2 ? 'show' : ''}`}>
            <li><Link to="/Backoffice/MedioTejoB/Buildings" className="dropdown-item2">{t('navbarMedioTejo.details')}</Link></li>
            <li><Link to="/Backoffice/MedioTejoB/AddBuilding" className="dropdown-item2">{t('navbarMedioTejo.addBuild')}</Link></li>
          </ul>
        </li>

        {/* Logout */}
        <li className="navbar-item" >
          <button
            onClick={() => {
              localStorage.removeItem('authorization');
              navigate('/');
            }}
            className="navbar-button"
            style={{ backgroundColor: '#00815a', color: 'white', fontWeight: 'bold' }}
          >
            {t('Logout')}
          </button>
        </li>
      </ul>
      <LanguageSwitcher />
    </nav>
  );
};

export default NavbarBackoffice;
