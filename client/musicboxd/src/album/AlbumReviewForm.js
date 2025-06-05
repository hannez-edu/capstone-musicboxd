import { useState } from "react";
import AlbumReviewFormStars from "./AlbumReviewFormStars";
import { fetchAddReview, fetchUpdateReview } from "./fetchReview";
import { GlobalTokenID } from "../Login";

const DEFAULT_REVIEW = {
    stars: 0,
    content: "",
};

function AlbumReviewForm({ review, albumId, afterSubmit, onCancel }) {
    const [currentReview, setCurrentReview] = useState(review == null ? DEFAULT_REVIEW : review);
    const [errors, setErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(false);

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

    function handleCancel() {
        if (onCancel) {
            onCancel();
        } else {
            setCurrentReview(DEFAULT_REVIEW);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setDisableSubmit(true);

        const submitReview = {...currentReview};

        if (review?.albumId) {
            submitReview.albumId = review.albumId;
        } else {
            submitReview.albumId = albumId;
        }

        if (review?.userId) {
            submitReview.userId = review.userId;
        } else {
            submitReview.userId = GlobalTokenID.id == null ? 0 : GlobalTokenID.id;
        }

        if (review == null) {
            fetchAddReview(submitReview)
                .then(response => {
                    if (response.status === 201 || response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject("Bad status code " + response.status);
                    }
                })
                .then(data => {
                    if (data.reviewId) {
                        if (afterSubmit != null) {
                            afterSubmit(data);
                        }
                        console.log(data);
                    } else {
                        setErrors(data);
                        setDisableSubmit(false);
                    }
                })
                .catch(console.log);
        } else {
            submitReview.user = null;
            fetchUpdateReview(submitReview)
                .then(response => {
                    if (response.status === 204) {
                        return null;
                    } else if (response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject("Bad status code " + response.status);
                    }
                })
                .then(data => {
                    if (data === null) {
                        if (afterSubmit != null) {
                            afterSubmit(currentReview);
                        }
                    } else {
                        setErrors(data);
                        setDisableSubmit(false);
                    }
                })
                .catch(console.log);
        }
        
    }

    return (
        <div>
            {errors.length >= 1 && (
                <div className="text-danger">
                    <p>The following errors were found with your review:</p>
                    <ul>
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}
            <form className="card p-2" onSubmit={handleSubmit}>
                <fieldset>
                    <textarea className="w-100" style={{"height": "75px"}} id={`${currentReview.userId}-content`} name="content" placeholder="Write your review here..." value={currentReview.content} onChange={handleContentChange}/>
                </fieldset>
                <div className="d-flex flex-row justify-content-between">
                    <fieldset>
                        <AlbumReviewFormStars onStarClick={handleStarChange} starCount={currentReview.stars} />  
                    </fieldset>
                    <div className="d-flex flex-row gap-2">
                        <button type="submit" className="btn btn-primary" disabled={disableSubmit}>Submit</button>
                        <button type="button" className="btn btn-danger" disabled={disableSubmit} onClick={() => handleCancel()}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AlbumReviewForm;
