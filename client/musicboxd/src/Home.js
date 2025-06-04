import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AlbumReview from "./album/AlbumReview";

const TEMP_ALBUM = {
    id: 1,
    title: "Test Album",
    artist: "Artist",
    firstReleasedDate: "2020-01-01",
    artUrl: "https://picsum.photos/id/77/500/500"
};

const TEMP_REVIEW = {
    id: 1,
    user: {
        userName: "User Name"
    },
    content: "Sed et tincidunt tellus. Sed mollis libero massa, at fringilla purus porttitor eu. Sed consequat arcu nunc, sit amet blandit nulla elementum ut. Vivamus at vestibulum lorem. Nunc leo nulla, semper ac eros sed, pharetra laoreet quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida nisl non diam dignissim sagittis. Etiam nec odio lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus magna quis neque aliquam, sit amet luctus nisl feugiat. Praesent non metus accumsan, imperdiet leo quis, rutrum dui. Maecenas gravida mollis sodales. Nullam commodo elementum eros, quis euismod orci consequat vel. Etiam lorem diam, efficitur nec diam id, facilisis elementum lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    stars: 3,
    likes: 10,
    likedByCurrentUser: false
};

function Home() {
  // State (below 3 should be fetched on load, useState)
  const [popular, setPopular] = useState([TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM]); // Popular Albums: 5 albums (May grab according to some order/metric)
  const [recentAlbums, setRecentAlbums] = useState([TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM, TEMP_ALBUM]); // Recently Listened By Followed (or in general) (Will need to know who the current user is for this if we do followed)
  const [latestReviewed, setLatestReviewed] = useState([TEMP_REVIEW, TEMP_REVIEW]); // Latest reviewed (~ 2 reviews should be fine)
  const navigate = useNavigate();
  const albumUrl = "http://localhost:8080/api/albums";
  const reviewUrl = "http://localhost:8080/api/reviews"

  // Each of these should be run once on mount

  // Fetch Albums (Both Popular & Recent)
  useEffect(() => {
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
        // TODO: Additional processing here to get "Recent" albums (could just grab the last 5 "listened" albums)
        // TODO: Might cache these if we need to grab the album from the review so we don't need another fetch? *****
      })
      .catch(console.log);

      // Fetch Reviews
      fetch(reviewUrl)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .then(data => {
          // TODO: Bundle the album with the review if the backend doesn't provide it.
        })
        .catch(console.log);
  }, []);

  const renderAlbums = (albums) => {
    return (
      <section className="container-fluid" id="popular">
        <div className="row row-cols-5 justify-content-center">
          {albums.map(album => (
            <div className="col" key={album.id}>
              <div className="card border-0">
                <img className="card-img-top" src={album === null || isEmptyString(album.artUrl) ? "" : album.artUrl} alt="Album cover"/>
                <div className="card-body text-center">
                  <p className="text-center word-break fs-4">{album === null ? "loading title..." : album.title}</p>
                  <p className="text-center word-break fs-5">{album === null ? "loading artist..." : album.artist}</p>
                  <Link className="stretched-link" to={`/album/${album.id}`} />
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
      {renderAlbums(popular)}

      <h2 className="mt-3 text-center">Recently Listened</h2>
      {renderAlbums(recentAlbums)}

      <h2 className="mt-3 text-center">Latest Reviews</h2>
      <section className="container-fluid" id="listened">
        <div className="row row-cols-2 justify-content-center">
          {latestReviewed.map(review => (
            <div className="col" key={review.id}>
              <div className="card border-0">
                <img className="card-img-top" src={TEMP_ALBUM.artUrl} alt="Album cover"/>
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
