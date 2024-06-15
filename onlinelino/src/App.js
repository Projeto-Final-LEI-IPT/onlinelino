import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
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
import CronologyIndex from "./pages/Building/Cronology";
import MapIndex from "./pages/Building/Map";
import ListIndex from "./pages/Building/List";
import BuildingDetails from "./pages/Building/Details";

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
            <Routes> {/* Replace div with Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/projeto/descricao" element={<DescriptionIndex />} />
              <Route path="/projeto/bibliografia" element={<BibliographyIndex />} />
              <Route path="/projeto/equipa" element={<TeamIndex />} />
              <Route path="/projeto/contactos" element={<ContactsIndex />} />
              <Route path="/biografia" element={<GenericIndex />} />
              <Route path="/biografia/sobre" element={<AboutIndex />} />
              <Route path="/obra/detalhes" element={<ProjectIndex />} />
              <Route path="/obra/cronologia" element={<CronologyIndex />} />
              <Route path="/obra/mapa" element={<MapIndex />} />
              <Route path="/obra/lista" element={<ListIndex />} />
              <Route path="/obra/:id/" element={<BuildingDetails />} />
            </Routes>
          </div>
        </div>
      </I18nextProvider>
    </Router>
  );
}

export default App;
