import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { GlobalTokenID } from "../Login";
import { fetchUpdateLikeReview } from "./fetchReview";

function Likes({ likesCount, isLiked, reviewId, setReviewLikes }) {
    const [likes, setLikes] = useState(likesCount);
    const [liked, setLiked] = useState(isLiked);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleLike() {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        if (liked) {
            if (setReviewLikes) {
                setReviewLikes(false, likes - 1);
            }

            setLiked(false);
            setLikes(likes - 1);
        } else {
            if (setReviewLikes) {
                setReviewLikes(true, likes + 1);
            }

            setLiked(true);
            setLikes(likes + 1);
        }

        fetchUpdateLikeReview(reviewId)
            .then(response => {
                if (response.status === 200) {
                    return null;
                } else if (response.status === 400 || response.status === 404) {
                    return response.json();
                } else {
                    return Promise.reject("Bad status code " + response.status);
                }
            })
            .then(data => {
                if (data) {
                    console.log(data);
                }
                setIsSubmitting(false);
            })
            .catch(console.log);
    }

    return (
        <div>
            <button
                className="d-flex flex-row gap-2 btn shadow-none"
                onClick={() => handleLike()}
                disabled={GlobalTokenID.id == null || GlobalTokenID.id === 0}
            >
                {liked ? (
                    <FaThumbsUp color="green" size="30px" />
                ) : (
                    <FaThumbsUp size="30px" />
                )}
                {likes}
            </button>
        </div>
    );
}

export default Likes;
