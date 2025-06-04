import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalTokenID } from "./Login";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Check if user is logged in and get their ID
  const isLoggedIn = GlobalTokenID.id && GlobalTokenID.token;
  const userCatalogPath = isLoggedIn
    ? `/catalog/${GlobalTokenID.id}`
    : "/login";

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <h1>
          <Link to={"/"}>MusicBoxd</Link>
        </h1>
        <form className="form-inline" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search for an album..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">
            Submit
          </button>
        </form>
        <Link to={"/login"}>Login</Link>
        {isLoggedIn ? (
          <Link to={userCatalogPath}>My Catalog</Link>
        ) : (
          <Link to={"/login"}>My Catalog</Link>
        )}
      </nav>
    </>
  );
}

export default Navbar;
