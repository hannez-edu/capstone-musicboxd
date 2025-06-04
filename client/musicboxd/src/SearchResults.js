import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);

  const query = searchParams.get("q") || "";

  const url = "https://musicbrainz.org/ws/2/release-group?query=";
  const limit = "&limit=5&fmt=json";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let results = fetchAlbumSearch(query);
      console.log(`DEBUG: Results: ${results}`);

      setResults(results);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchAlbumSearch = (query) => {
    const get = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MusicBoxd (https://github.com/hannez-edu/capstone-musicboxd/)'
      }
    };

    let returnedAlbums = [];

    fetch((url + query + limit), get)
      .then(response => {
        if (response.status === 200) {
          // Got results
          return response.json();
        } else { // Search failed
          return Promise.reject(`Search failed! Status code: ${response.status}`);
        }
      })
      .then(data => {
        if (data["release-groups"]) {
          data = data["release-groups"];
          let albums = [];
          for (let i = 0; i < data.length; i++) {
            let album = {
              id: data[i].id,
              title: data[i].title,
              artist: data[i]["artist-credit"][0].name,
            };
            albums.push(album);
          }
          return albums;
        } else {
          return []; // Search returned nothing
        }
      })
      .then(async albums => {
        for (let i = 0; i < albums.length; i++) {
          albums[i].artUrl = await fetchArt(albums[i].id);
          returnedAlbums.push(albums[i]);
        }
      });

      return returnedAlbums;
  }

  const fetchArt = async (releaseId) => {
    const artRequestUrl = `http://coverartarchive.org/release-group/${releaseId}`;
    
    const get = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MusicBoxd (https://github.com/hannez-edu/capstone-musicboxd/)'
      }
    };

    // If we don't get an album cover, we should have a dummy placeholder image to display
    let coverImg = "http://dummyimage.com/100x100.png/ff4444/ffffff";

    return fetch(artRequestUrl, get)
      .then(response => {
        if (response.status === 200) {
          // Got art!
          return response.json();
        } else { // Couldn't find a cover - should return the placeholder image.
          return {
            images: [
              {
                thumbnails: {
                  small: coverImg
                }
              }
            ]
          };
        }
      })
      .then(data => {
        coverImg = data.images[0].thumbnails.small;
        return coverImg;
      });
  };

  const handleAlbumClick = (album) => {
    // TODO: save the album to the database - database handles deduplication via album - artist combination.
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
