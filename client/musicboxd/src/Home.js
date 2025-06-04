import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AlbumReview from "./album/AlbumReview";
import { fetchLatestReviews } from "./album/fetchReview";

const TEMP_ALBUM = {
    id: 1,
    title: "Test Album",
    artist: "Artist",
    firstReleasedDate: "2020-01-01",
    artUrl: "https://picsum.photos/id/77/500/500",
    isTemp: true
};

const TEMP_REVIEW = {
    id: 1,
    userId: -1,
    user: {
        userName: "User Name"
    },
    content: "Sed et tincidunt tellus. Sed mollis libero massa, at fringilla purus porttitor eu. Sed consequat arcu nunc, sit amet blandit nulla elementum ut. Vivamus at vestibulum lorem. Nunc leo nulla, semper ac eros sed, pharetra laoreet quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida nisl non diam dignissim sagittis. Etiam nec odio lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus magna quis neque aliquam, sit amet luctus nisl feugiat. Praesent non metus accumsan, imperdiet leo quis, rutrum dui. Maecenas gravida mollis sodales. Nullam commodo elementum eros, quis euismod orci consequat vel. Etiam lorem diam, efficitur nec diam id, facilisis elementum lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    stars: 3,
    likes: 10,
    likedByCurrentUser: false,
    isTemp: true,
    album: {
      artUrl: "https://picsum.photos/id/77/500/500"
    }
};

function Home() {
  // State (below 3 should be fetched on load, useState)
  const [popular, setPopular] = useState([TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM]); // Popular Albums: 5 albums (May grab according to some order/metric)
  const [recentAlbums, setRecentAlbums] = useState([TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM]); // Recently Listened By Followed (or in general) (Will need to know who the current user is for this if we do followed)
  const [latestReviewed, setLatestReviewed] = useState([TEMP_REVIEW, TEMP_REVIEW]); // Latest reviewed (~ 2 reviews should be fine)
  const [allCatalogs, setAllCatalogs] = useState(null); // Used to determine other album-related states
  const navigate = useNavigate();
  const albumUrl = "http://localhost:8080/api/albums";
  const reviewUrl = "http://localhost:8080/api/reviews";
  const catalogUrl = "http://localhost:8080/api/catalog";

  // Each of these should be run once on mount

  useEffect(() => {
    fetch(catalogUrl)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      })
      .then(data => {
        setAllCatalogs(data.filter((cata) => cata.status === "LISTENED"));
      })
      .catch(console.log);
  }, []);

  // Fetch Albums (Both Popular & Recent)
  useEffect(() => {
    if (allCatalogs == null) {
      return;
    }

    fetch(albumUrl)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      })
      .then(data => {
        // TODO: Additional processing here to get "Popular" albums (by listened count?)
        const popularityAlbums = JSON.parse(JSON.stringify(data));
        for (let album of popularityAlbums) {
          album.popularity = allCatalogs.filter((cata) => cata.albumId === album.albumId).length;
        }
        setPopular(popularityAlbums.sort((a, b) => b.popularity - a.popularity).slice(0, 5));
        // TODO: Additional processing here to get "Recent" albums (could just grab the last 5 "listened" albums)
        const recentListenedAlbums = new Set();
        for (let i = allCatalogs.length - 1; i >= 0; i--) {
          recentListenedAlbums.add(allCatalogs[i].albumId);
          if (recentListenedAlbums.size >= 5) {
            break;
          }
        }
        setRecentAlbums(data.filter((alb) => recentListenedAlbums.has(alb.albumId)));
        // TODO: Might cache these if we need to grab the album from the review so we don't need another fetch? *****
      })
      .catch(console.log);

      
  }, [allCatalogs]);

  useEffect(() => {
    // Fetch Reviews
    fetchLatestReviews(2)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      })
      .then(data => {
        if (data) {
          setLatestReviewed(data);
        }
      })
      .catch(console.log);
  }, []);

  const renderAlbums = (albums, extraKey) => {
    return (
      <section className="container-fluid" id={extraKey}>
        <div className="row row-cols-5 justify-content-center">
          {albums.map((album, i) => (
            <div className="col" key={`${i}/${album.albumId}/${extraKey}`}>
              <div className="card border-0">
                <img className="card-img-top" src={album === null || isEmptyString(album.artUrl) ? "" : album.artUrl} alt="Album cover"/>
                <div className="card-body text-center">
                  <p className="text-center word-break fs-4">{album === null ? "loading title..." : album.title}</p>
                  <p className="text-center word-break fs-5">{album === null ? "loading artist..." : album.artist}</p>
                  <Link className="stretched-link" to={`/album/${album.albumId}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <h2 className="mt-3 text-center">Popular</h2>
      {popular.isTemp == null && renderAlbums(popular, "popular")}

      <h2 className="mt-3 text-center">Recently Listened</h2>
      {recentAlbums.isTemp == null && renderAlbums(recentAlbums, "recent")}

      <h2 className="mt-3 text-center">Latest Reviews</h2>
      <section className="container-fluid" id="listened">
        <div className="row row-cols-2 justify-content-center">
          {latestReviewed.map((review, i) => (
            <div className="col" key={`${i}/${review.id}`}>
              <div className="card border-0">
                <img className="card-img-top" src={review.album.artUrl} alt="Album cover"/>
                <AlbumReview className="card-body" review={review} />
                <Link className="stretched-link" to={`/album/${review.albumId}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function isEmptyString(str) {
    return str === null || str === undefined || str.trim() === "";
}

export default Home;
