import Stars from "./Stars";

function AlbumReview({ review }) {
    return (
        <div className="d-flex flex-column">
            <div name="review heading" className="d-flex flex-row justify-content-between">
                <h5>{review.user?.userName}</h5>
                <Stars starCount={review.stars} />
            </div>
            <p name="review content" className="mb-0">
                {review.content}
            </p>
        </div>
    );
}

export default AlbumReview;
