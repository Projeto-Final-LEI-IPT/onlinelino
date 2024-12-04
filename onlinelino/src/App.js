import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import Home from "./pages/Home";
import DescriptionIndex from "./pages/Project/Description";
import BibliographyIndex from "./pages/Project/Bibliography";
import TeamIndex from "./pages/Project/Team";
import ContactsIndex from "./pages/Project/Contacts";
import GenericIndex from "./pages/Biography/Generic";
import AboutIndex from "./pages/Biography/About";
import ProjectIndex from "./pages/Building/Index";
import ChronologyIndex from "./pages/Building/Chronology";
import MapIndex from "./pages/Building/Map";
import ListIndex from "./pages/Building/List";
import BuildingDetails from "./pages/Building/Details";
import Login from './pages/Backoffice/Login';
import AboutB from './pages/Backoffice/BiographyB/AboutB';
import IconicB from './pages/Backoffice/BiographyB/IconicB';
import GenericB from './pages/Backoffice/BiographyB/GenericB';
import BibliographyB from './pages/Backoffice/ProjectB/BibliographyB';
import ContactsB from './pages/Backoffice/ProjectB/ContactsB';
import DescriptionB from './pages/Backoffice/ProjectB/DescriptionB';
import TeamB from './pages/Backoffice/ProjectB/TeamB';
import ChronolyB from './pages/Backoffice/BuildingB/ChronolyB';
import DetailsB from './pages/Backoffice/BuildingB/DetailsB';



import EquipaTest from './Backoffice/Equipa';
import Login from './pages/Login';

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
              <Route path="/" element={<Home />} />
              <Route path="/projeto/descricao" element={<DescriptionIndex />} />
              <Route path="/projeto/bibliografia" element={<BibliographyIndex />} />
              <Route path="/projeto/equipa" element={<TeamIndex />} />
              <Route path="/projeto/contactos" element={<ContactsIndex />} />
              <Route path="/biografia" element={<GenericIndex />} />
              <Route path="/biografia/sobre" element={<AboutIndex />} />
              <Route path="/obra/detalhes" element={<ProjectIndex />} />
              <Route path="/obra/cronologia" element={<ChronologyIndex />} />
              <Route path="/obra/mapa" element={<MapIndex />} />
              <Route path="/obra/lista" element={<ListIndex />} />
              <Route path="/obra/:id/" element={<BuildingDetails />} />
              <Route path="backoffice/login" element={<Login />} />
              <Route path="/backoffice/BiographyB/AboutB" element={<AboutB />} />
              <Route path="/backoffice/BiographyB/GenericB" element={<GenericB />} />
              <Route path="/backoffice/BiographyB/IconicB" element={<IconicB />} />
              <Route path="/backoffice/ProjectB/BibliographyB" element={<BibliographyB />} />
              <Route path="/backoffice/ProjectB/ContactsB" element={<ContactsB />} />
              <Route path="/backoffice/ProjectB/DescriptionB" element={<DescriptionB />} />
              <Route path="/backoffice/ProjectB/TeamB" element={<TeamB />} />
              <Route path="/backoffice/BuildingB/ChronolyB" element={<ChronolyB />} />
              <Route path="/backoffice/BuildingB/DetailsB" element={<DetailsB />} />
              <Route path="/equipa" element={<EquipaTest />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </I18nextProvider>
    </Router>
  );
}

export default App;
