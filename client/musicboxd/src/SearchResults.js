import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

// Temporary search data
const TEMP_SEARCH_RESULTS = [
  {
    id: 1,
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    artUrl: "http://dummyimage.com/100x100.png/cc0000/ffffff",
  },
  {
    id: 2,
    title: "Thriller",
    artist: "Michael Jackson",
    artUrl: "http://dummyimage.com/100x100.png/ff4444/ffffff",
  },
  {
    id: 3,
    title: "Abbey Road",
    artist: "The Beatles",
    artUrl: "http://dummyimage.com/100x100.png/dddddd/000000",
  },
  {
    id: 4,
    title: "Nevermind",
    artist: "Nirvana",
    artUrl: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
  },
  {
    id: 5,
    title: "OK Computer",
    artist: "Radiohead",
    artUrl: "http://dummyimage.com/100x100.png/ff4444/ffffff",
  },
  {
    id: 6,
    title: "Back in Black",
    artist: "AC/DC",
    artUrl: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
  },
  {
    id: 7,
    title: "The Joshua Tree",
    artist: "U2",
    artUrl: "http://dummyimage.com/100x100.png/dddddd/000000",
  },
  {
    id: 8,
    title: "Rumours",
    artist: "Fleetwood Mac",
    artUrl: "http://dummyimage.com/100x100.png/cc0000/ffffff",
  }
];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Filter the temporary results based on the query, this would be an API call to MusicBrainz
      const filteredResults = TEMP_SEARCH_RESULTS.filter(
        (album) =>
          album.title.toLowerCase().includes(query.toLowerCase()) ||
          album.artist.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filteredResults);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAlbumClick = (album) => {
    // TODO: save the album to the database
    console.log(`Album clicked: ${album.title} by ${album.artist}`);
    // Then navigate to the album page would happen via the Link
  };

  return (
    <div className="container mt-4">
      <h2>Search Results for "{query}"</h2>

      {results.length === 0 ? (
        <div className="alert alert-info mt-4">
          No albums found matching "{query}". Try a different search term.
        </div>
      ) : (
        <div className="row mt-4">
          {results.map((album) => (
            <div key={album.id} className="col-md-3 mb-4">
              <div
                className="card h-100"
                onClick={() => handleAlbumClick(album)}
              >
                <Link
                  to={`/album/${album.id}`}
                  className="text-decoration-none"
                >
                  <img
                    src={album.artUrl}
                    className="card-img-top"
                    alt={`${album.title} album cover`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{album.title}</h5>
                    <p className="card-text">{album.artist}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
