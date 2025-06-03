import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlbumReview from "./album/AlbumReview";

// TODO: Clicking on an album should navigate the user to the page corresponding to that album.
// Would probably be easiest to do so via albumID. When doing an initial fetch, ensure that we store the ID along w/ the album object.
//
// TODO: Should probably include some album information / a cover on the reviews (clicking on those can also take the user to that album's page - maybe clicking on the username could take the user to that user's catalog?)

// For the purposes of the Home page, we ignore firstReleased
const TEMP_ALBUM = {
    title: "Test Album AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    artist: "Artist",
    firstReleasedDate: "2020-01-01",
    artUrl: "https://picsum.photos/id/77/500/500"
};

const TEMP_REVIEW = {
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

  return (
    <>
      <h2 className="mt-3 text-center">Popular</h2>
      <section className="container-fluid" id="popular">
        <div className="row justify-content-center">
          {popular.map(album => (
            <div className="col-2">
              <div className="card">
                <img className="card-img-top w-100" src={album === null || isEmptyString(album.artUrl) ? "" : album.artUrl} alt="Album cover"/>
                <div className="card-body text-center">
                  <h4 classname="text-center text-break">{album === null ? "loading title..." : album.title}</h4>
                  <h5 classname="text-center text-break">{album === null ? "loading artist..." : album.artist}</h5>
                  <a href="#" className="d-print-none stretched-link">Go somewhere</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-3 text-center">Recently Listened</h2>
      <section className="container-fluid" id="recent">
        <div className="row justify-content-center">
          {recentAlbums.map(album => (
            <div className="col-2">
              <div className="card">
                <img className="card-img-top w-100" src={album === null || isEmptyString(album.artUrl) ? "" : album.artUrl} alt="Album cover"/>
                <div className="card-body text-center">
                  <h4 classname="text-center">{album === null ? "loading title..." : album.title}</h4>
                  <h5 classname="text-center">{album === null ? "loading artist..." : album.artist}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-3 text-center">Latest Reviews</h2>
      <section className="container-fluid" id="listened">
        <div className="row justify-content-center">
          {latestReviewed.map(review => (
            <div className="col-5">
              <div className="card">
                <img className="card-img-top w-100" src={TEMP_ALBUM.artUrl} alt="Album cover"/>
                <AlbumReview className="card-body" review={review} />
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
