import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";
import AlbumPage from "./AlbumPage";
import CatalogPage from "./CatalogPage";
import SearchResults from "./SearchResults";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import NotFound from "./NotFound";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/album/:id" element={<AlbumPage currentUserId={1} />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalog/:userId" element={<CatalogPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
