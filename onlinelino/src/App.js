import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  return (
    <div className="App">
      <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
        <BrowserRouter>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Home />} />
            {/* Project */}
            <Route path="/projeto/descricao" element={<DescriptionIndex />} />
            <Route path="/projeto/bibliografia" element={<BibliographyIndex />} />
            <Route path="/projeto/equipa" element={<TeamIndex />} />
            <Route path="/projeto/contactos" element={<ContactsIndex />} />
            {/* Biography */}
            <Route path="/biografia" element={<GenericIndex />} />
            <Route path="/biografia/sobre" element={<AboutIndex />} />
            {/* Building */}
            <Route path="/obra" element={<ProjectIndex />} />
            <Route path="/obra/cronologia" element={<CronologyIndex />} />
            <Route path="/obra/mapa" element={<MapIndex />} />
            <Route path="/obra/lista" element={<ListIndex />} />
            <Route path="/obra/:id/" element={<BuildingDetails />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
