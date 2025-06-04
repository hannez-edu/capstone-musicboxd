import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CatalogTabs from "./catalog/CatalogTabs";
import CatalogGrid from "./catalog/CatalogGrid";
import CatalogReviewsGrid from "./catalog/CatalogReviewsGrid";
import FollowButton from "./catalog/FollowButton";

function CatalogPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [listenedAlbums, setListenedAlbums] = useState([]);
  const [wantToListenAlbums, setWantToListenAlbums] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("LISTENED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all catalog data
  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      // First, fetch the user by ID
      fetch(`http://localhost:8080/api/user/${userId}`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .then((userData) => {
          setUser(userData);

          // Then fetch catalog entries for this user
          return fetch(`http://localhost:8080/api/catalog/users/${userId}`)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                return Promise.reject(
                  `Unexpected Status Code: ${response.status}`
                );
              }
            })
            .then((catalogEntries) => {
              // Separate catalog entries by status
              const listenedEntries = catalogEntries.filter(
                (entry) => entry.status === "LISTENED"
              );
              const wantToListenEntries = catalogEntries.filter(
                (entry) => entry.status === "WANT_TO_LISTEN"
              );

              // Get album details for listened albums
              const listenedAlbumPromises = listenedEntries.map((entry) =>
                fetch(
                  `http://localhost:8080/api/albums/album=${entry.albumId}&user=${userId}`
                ).then((response) => {
                  if (response.status === 200) {
                    return response.json();
                  } else {
                    return null; // Skip failed albums
                  }
                })
              );

              // Get album details for want-to-listen albums
              const wantToListenAlbumPromises = wantToListenEntries.map(
                (entry) =>
                  fetch(
                    `http://localhost:8080/api/albums/album=${entry.albumId}&user=${userId}`
                  ).then((response) => {
                    if (response.status === 200) {
                      return response.json();
                    } else {
                      return null; // Skip failed albums
                    }
                  })
              );

              // Get user reviews
              const reviewsPromise = fetch(
                `http://localhost:8080/api/reviews/reviewer=${userId}&user=${userId}`
              ).then((response) => {
                if (response.status === 200) {
                  return response.json();
                } else {
                  return []; // Return empty array if no reviews
                }
              });

              // Wait for all album details and reviews
              return Promise.all([
                Promise.all(listenedAlbumPromises),
                Promise.all(wantToListenAlbumPromises),
                reviewsPromise,
              ]);
            })
            .then(
              ([listenedAlbumsData, wantToListenAlbumsData, reviewsData]) => {
                // Filter out null albums
                setListenedAlbums(
                  listenedAlbumsData.filter((album) => album !== null)
                );
                setWantToListenAlbums(
                  wantToListenAlbumsData.filter((album) => album !== null)
                );
                setReviews(reviewsData);
                setLoading(false);
              }
            );
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          setLoading(false);
        });
    }
  }, [userId]);

  const renderTabContent = () => {
    if (loading) {
      return <div className="text-center my-5">Loading...</div>;
    }

    if (error) {
      return <div className="text-center my-5 text-danger">Error: {error}</div>;
    }

    switch (activeTab) {
      case "LISTENED":
        return <CatalogGrid albums={listenedAlbums} />;
      case "WANT_TO_LISTEN":
        return <CatalogGrid albums={wantToListenAlbums} />;
      case "REVIEWS":
        return <CatalogReviewsGrid reviews={reviews} />;
      default:
        return <CatalogGrid albums={listenedAlbums} />;
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">Loading catalog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Error loading catalog: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{user?.userName}'s Catalog</h1>
        <FollowButton username={user?.userName} />
      </div>

      <CatalogTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
}

export default CatalogPage;
