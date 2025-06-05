import { Link } from "react-router-dom";

function CatalogGrid({ albums }) {
  if (!albums || albums.length === 0) {
    return (
      <div className="text-center my-5">No albums in this catalog yet.</div>
    );
  }

  return (
    <section className="container-fluid">
      <div className="row row-cols-5 justify-content-center">
        {albums.map((album) => (
          <div key={album.albumId} className="col">
            <div className="card border-0">
              <img
                src={
                  album.artUrl ||
                  "http://dummyimage.com/100x100.png/dddddd/000000"
                }
                className="card-img-top"
                alt={`${album.title} album cover`}
                onError={(e) => {
                  e.target.src =
                    "http://dummyimage.com/100x100.png/dddddd/000000";
                }}
              />
              <div className="card-body text-center">
                <p className="text-center word-break fs-4">{album.title}</p>
                <p className="text-center word-break fs-5">{album.artist}</p>
                <Link
                  className="stretched-link"
                  to={`/album/${album.albumId}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CatalogGrid;
