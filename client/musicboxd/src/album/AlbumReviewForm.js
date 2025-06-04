import { useState } from "react";
import AlbumReviewFormStars from "./AlbumReviewFormStars";

const DEFAULT_REVIEW = {
    stars: 0,
    content: "",
};

function AlbumReviewForm({ review = DEFAULT_REVIEW }) {
    const [currentReview, setCurrentReview] = useState(review);
    const [errors, setErrors] = useState([]);

    function handleContentChange(event) {
        const rev = {...currentReview};

        rev.content = event.target.value;
        
        setCurrentReview(rev);
    }

    function handleStarChange(starCount) {
        const rev = {...currentReview};

        rev.stars = starCount;

        setCurrentReview(rev);
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log(currentReview);
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <textarea className="w-100" id={`${review.userId}-content`} name="content" placeholder="Write your review here..." value={currentReview.content} onChange={handleContentChange}/>
            </fieldset>
            <div className="d-flex flex-row justify-content-between">
                <fieldset>
                    <AlbumReviewFormStars onStarClick={handleStarChange} starCount={review.stars} />  
                </fieldset>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    )
}

export default AlbumReviewForm;
