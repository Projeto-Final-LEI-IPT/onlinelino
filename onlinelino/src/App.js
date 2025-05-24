import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Home from "./pages/Home";
import DescriptionIndex from "./pages/Project/Description";
import BibliographyIndex from "./pages/Project/Bibliography";
import TeamIndex from "./pages/Project/Team";
import ContactsIndex from "./pages/Project/Contacts";
import GenericIndex from "./pages/Carreer/Generic";
import AboutIndex from "./pages/Carreer/About";
import ProjectIndex from "./pages/MedioTejo/Index";
import ChronologyIndex from "./pages/MedioTejo/Chronology";
import MapIndex from "./pages/MedioTejo/Map";
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
  <Route path="/projeto/descricao" element={<DescriptionIndex />} />
  <Route path="/project/description" element={<DescriptionIndex />} />

  <Route path="/projeto/bibliografia" element={<Bibliography />} />
  <Route path="/project/bibliography" element={<Bibliography />} />

  <Route path="/projeto/equipa" element={<Team />} />
  <Route path="/project/team" element={<Team />} />

  <Route path="/projeto/contactos" element={<Contacts />} />
  <Route path="/project/contacts" element={<Contacts />} />

  {/* Público - Biografia */}
  <Route path="/Carreira" element={<GenericIndex />} />
  <Route path="/Career" element={<GenericIndex />} />

  <Route path="/Carreira/sobre" element={<AboutIndex />} />
  <Route path="/Career/about" element={<AboutIndex />} />

  {/* Público - Obra */}
  <Route path="/MedioTejo/detalhes" element={<ProjectIndex />} />
  <Route path="/MedioTejo/details" element={<ProjectIndex />} />

  <Route path="/MedioTejo/cronologia" element={<ChronologyIndex />} />
  <Route path="/MedioTejo/chronology" element={<ChronologyIndex />} />

  <Route path="/MedioTejo/mapa" element={<MapIndex />} />
  <Route path="/MedioTejo/map" element={<MapIndex />} />

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
