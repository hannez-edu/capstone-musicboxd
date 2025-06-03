import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <h1>
          <Link to={"/"}>MusicBoxd</Link>
        </h1>
        <form className="form-inline">
          <input type="search" placeholder="Search for an album..."></input>
          <button className="btn btn-outline-primary" type="submit">
            Submit
          </button>
        </form>
        <Link to={"/"}>My Catalog</Link>
      </nav>
    </>
  );
}

export default Navbar;
