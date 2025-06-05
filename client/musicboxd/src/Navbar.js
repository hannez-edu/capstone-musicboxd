import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "./Login";
import { FaMagnifyingGlass } from "react-icons/fa6";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    AuthService.clearAuth();
    navigate("/");
  };

  // Check if user is logged in and get their ID
  const isLoggedIn = AuthService.isLoggedIn();
  const auth = AuthService.getAuth();
  const userCatalogPath = isLoggedIn && auth ? `/catalog/${auth.id}` : "/login";

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <h1>
          <Link to={"/"}>MusicBoxd</Link>
        </h1>
        <form className="d-flex gap-2" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search for an album..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">
            <FaMagnifyingGlass size="20px" />
          </button>
        </form>
        {isLoggedIn ? (
          <>
            <Link to={userCatalogPath}>My Catalog</Link>
            <button className="btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to={"/login"}>Login</Link>
        )}
      </nav>
    </>
  );
}

export default Navbar;
