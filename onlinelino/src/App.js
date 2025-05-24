import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Home from "./pages/Home";
import Description from "./pages/Project/Description";
import Bibliography from "./pages/Project/Bibliography";
import Team from "./pages/Project/Team";
import Contacts from "./pages/Project/Contacts";
import Generic from "./pages/Carreer/Generic";
import About from "./pages/Carreer/About";
import Project from "./pages/MedioTejo/Index";
import Chronology from "./pages/MedioTejo/Chronology";
import Map from "./pages/MedioTejo/Map";
import ListIndex from "./pages/MedioTejo/List";
import BuildingDetails from "./pages/MedioTejo/Details";
import Login from './pages/Backoffice/Login';
import AboutB from './pages/Backoffice/BiographyB/AboutB';
import IconicB from './pages/Backoffice/BiographyB/IconicB';
import GenericB from './pages/Backoffice/BiographyB/GenericB';
import BibliographyB from './pages/Backoffice/ProjectB/BibliographyB';
import ContactsB from './pages/Backoffice/ProjectB/ContactsB';
import DescriptionB from './pages/Backoffice/ProjectB/DescriptionB';
import TeamB from './pages/Backoffice/ProjectB/TeamB';
import Iconic from './pages/Carreer/Iconic';

// 🛠️ Backoffice - Obra
import ChronolyB from './pages/Backoffice/BuildingB/ChronolyB';
import DetailsB from './pages/Backoffice/BuildingB/DetailsB';

function App() {
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <Router>
      <I18nextProvider i18n={i18n}>
        <div className="App">
          <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
          <Routes>
  {/* Público - Principal */}
  <Route path="/" element={<Home />} />
  
  {/* Público - Projeto */}
  <Route path="/projeto/descricao" element={<Description />} />
  <Route path="/project/description" element={<Description />} />

  <Route path="/projeto/bibliografia" element={<Bibliography />} />
  <Route path="/project/bibliography" element={<Bibliography />} />

  <Route path="/projeto/equipa" element={<Team />} />
  <Route path="/project/team" element={<Team />} />

  <Route path="/projeto/contactos" element={<Contacts />} />
  <Route path="/project/contacts" element={<Contacts />} />

  {/* Público - Biografia */}
  <Route path="/Carreira" element={<Generic />} />
  <Route path="/Career" element={<Generic />} />

  <Route path="/Carreira/sobre" element={<About />} />
  <Route path="/Career/about" element={<About />} />

  <Route path="/Carreira/iconico" element={<Iconic/>}/>
  <Route path="/Career/iconic" element={<Iconic/>}/>


  {/* Público - Obra */}
  <Route path="/MedioTejo/detalhes" element={<Project />} />
  <Route path="/MedioTejo/details" element={<Project />} />

  <Route path="/MedioTejo/cronologia" element={<Chronology />} />
  <Route path="/MedioTejo/chronology" element={<Chronology />} />

  <Route path="/MedioTejo/mapa" element={<Map />} />
  <Route path="/MedioTejo/map" element={<Map />} />

  <Route path="/MedioTejo/lista" element={<ListIndex />} />
  <Route path="/MedioTejo/list" element={<ListIndex />} />

  <Route path="/MedioTejo/:id" element={<BuildingDetails />} />
  <Route path="/MedioTejo/:id" element={<BuildingDetails />} />

  {/* Login */}
  <Route path="/backoffice/login" element={<Login />} />

  {/* Backoffice - Biografia */}
  <Route path="/backoffice/BiographyB/AboutB" element={<AboutB />} />
  <Route path="/backoffice/BiographyB/GenericB" element={<GenericB />} />
  <Route path="/backoffice/BiographyB/IconicB" element={<IconicB />} />

  {/* Backoffice - Projeto */}
  <Route path="/backoffice/ProjectB/BibliographyB" element={<BibliographyB />} />
  <Route path="/backoffice/ProjectB/ContactsB" element={<ContactsB />} />
  <Route path="/backoffice/ProjectB/DescriptionB" element={<DescriptionB />} />
  <Route path="/backoffice/ProjectB/TeamB" element={<TeamB />} />

  {/* Backoffice - Obra */}
  <Route path="/backoffice/BuildingB/ChronolyB" element={<ChronolyB />} />
  <Route path="/backoffice/BuildingB/DetailsB" element={<DetailsB />} />
</Routes>

          </div>
        </div>
      </I18nextProvider>
    </Router>
  );
}

export default App;
