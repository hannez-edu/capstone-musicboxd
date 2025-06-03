import { Link } from "react-router-dom";

function CatalogGrid({ albums }) {
  if (!albums || albums.length === 0) {
    return (
      <div className="text-center my-5">No albums in this catalog yet.</div>
    );
  }

  return (
    <div className="row row-cols-2 row-cols-md-4 g-4">
      {albums.map((album) => (
        <div key={album.id} className="col">
          <div className="card h-100 border-0">
            <Link to={`/album/${album.id}`}>
              <img
                src={album.artUrl}
                className="card-img-top"
                alt={`${album.title} album cover`}
              />
              <div className="card-body px-0">
                <h5 className="card-title mb-0">{album.title}</h5>
                <p className="card-text text-muted">{album.artist}</p>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CatalogGrid;
