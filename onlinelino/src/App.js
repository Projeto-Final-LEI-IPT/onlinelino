import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectIndex from "./pages/Project/Index";

function App() {
  return (
    <div className="App">
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<ProjectIndex />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
