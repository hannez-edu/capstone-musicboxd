import { Link } from "react-router-dom";
import Likes from "../album/Likes";

function CatalogReviewsGrid({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center my-5">No reviews in this catalog yet.</div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {reviews.map((review) => (
        <div key={review.id} className="col">
          <div className="card mb-3">
            <div className="row g-0">
              <div className="col-md-4">
                <Link to={`/album/${review.albumId}`}>
                  <img
                    src={review.album.artUrl}
                    className="img-fluid rounded-start"
                    alt={`${review.album.title} album cover`}
                  />
                </Link>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <Link to={`/album/${review.albumId}`}>
                    <h5 className="card-title">{review.album.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {review.album.artist}
                    </h6>
                  </Link>
                  <p className="card-text">
                    {review.content.substring(0, 100)}...
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.stars ? "text-warning" : "text-muted"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <Likes
                      likesCount={review.likes}
                      isLiked={review.likedByCurrentUser}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CatalogReviewsGrid;
