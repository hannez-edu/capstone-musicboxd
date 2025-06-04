import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";
import CatalogPage from "./CatalogPage";
import SearchResults from "./SearchResults";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";


function App() {
  return (
    <Router>
      <Navbar />
     <div className="container">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/catalog/:username" element={<CatalogPage />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
