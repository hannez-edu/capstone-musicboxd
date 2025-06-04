import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
        <Link to={"/catalog/current-user"}>My Catalog</Link>
      </nav>
    </>
  );
}

export default Navbar;
