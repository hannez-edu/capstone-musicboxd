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
          <div className="card border-0 review-card">
            <div className="review-card-content">
              <div className="review-text-content">
                <h5 className="review-username">
                  {review.user?.userName || "Anonymous"}
                </h5>
                <p className="review-content-text">{review.content}</p>
              </div>
              <div className="review-album-image">
                <Link to={`/album/${review.albumId}`}>
                  <img
                    src={review.album.artUrl}
                    className="review-img"
                    alt={`${review.album.title} album cover`}
                  />
                </Link>
              </div>
            </div>
            <div className="review-card-footer">
              <div className="d-flex justify-content-between align-items-center">
                <Link
                  to={`/album/${review.albumId}`}
                  className="text-decoration-none"
                >
                  <h6 className="card-title mb-1">{review.album.title}</h6>
                  <p className="card-subtitle text-muted mb-0">
                    {review.album.artist}
                  </p>
                </Link>
                <div className="d-flex align-items-center gap-3">
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
                    reviewId={review.id}
                    setReviewLikes={null}
                  />
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
