import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { fetchAddAlbum } from "./album/fetchAlbum";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(true); // Swaps to false when we're done searching to show a msg that we're searching.
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const url = "https://musicbrainz.org/ws/2/release-group?query=";
  const limit = "&limit=8&fmt=json";

  useEffect(() => {
    setResults([]); // Clear on init
    setSearching(true);
    let fetched = fetchAlbumSearch(query);

    const timeoutId = setTimeout(() => {
      console.log(fetched);
      setSearching(false);
      setResults(fetched);
    }, 3000);

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
              albumId: data[i].id,
              title: data[i].title,
              artist: data[i]["artist-credit"][0].name,
              firstReleaseDate: data[i]["first-release-date"]
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
          albums[i].artUrl = await fetchArt(albums[i].albumId);
          returnedAlbums.push(albums[i]);
          forceUpdate();
        }
        return returnedAlbums;
      })
      .catch(console.log);

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
    let coverImg = "https://placehold.co/250?text=No+Cover";

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
        forceUpdate();
        return coverImg;
      })
      .catch(console.log);
  };

  const handleAlbumClick = (album) => {
    console.log(`Album clicked: ${album.title} by ${album.artist} on ${album.firstReleaseDate}`);
    album.albumId = 0; // Clear ID to something the backend can parse properly
    
    fetchAddAlbum(album)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.albumId) {
          console.log("DEBUG: Data received");
          console.log(JSON.stringify(data));
          navigate(`/album/${data.albumId}`);
        }
      })
      .catch(console.log);
      
    // Then, the Link should navigate us to the correct in-DB album page!
  };

  return (
    <div className="container mt-4">
      <h2>Search Results for "{query}"</h2>
      {searching && (
        <div className="alert alert-info mt-4">
          Searching, please wait...
        </div>
      )}

      {!searching && results.length === 0 ? (
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
                <img
                  src={album.artUrl}
                  className="card-img-top"
                  alt={`${album.title} album cover`}
                />
                <div className="card-body">
                  <h5 className="card-title">{album.title}</h5>
                  <p className="card-text">{album.artist}</p>
                </div>
                <a href="#" className="stretched-link"></a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
