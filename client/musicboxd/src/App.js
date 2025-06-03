import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";
import CatalogPage from "./CatalogPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/catalog/:username" element={<CatalogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
