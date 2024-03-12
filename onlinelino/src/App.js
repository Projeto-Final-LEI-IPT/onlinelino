import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectIndex from "./pages/Project/Index";
import TeamIndex from "./pages/Team";
import BiographyIndex from "./pages/Biography";

function App() {
  return (
    <div className="App">
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<ProjectIndex />} />
            <Route path="/team" element={<TeamIndex />} />
            <Route path="/biography" element={<BiographyIndex />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
