import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";
import AlbumPage from "./AlbumPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
    </Router>
  );
}

export default App;
