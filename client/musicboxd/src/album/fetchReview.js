import { GlobalTokenID } from "../Login";

const BASE_URL = "http://localhost:8080/api/reviews";

function fetchAddReview(review) {
    const init = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GlobalTokenID.token
        },
        body: JSON.stringify(review),
    };

    return fetch(`${BASE_URL}`, init);
}

function fetchUpdateReview(review) {
    const init = {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GlobalTokenID.token
        },
        body: JSON.stringify(review),
    };

    return fetch(`${BASE_URL}/${review.reviewId}`, init);
}

function fetchDeleteReview(reviewId) {
    const init = {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + GlobalTokenID.token
        }
    };

    return fetch(`${BASE_URL}/${reviewId}`, init);
}

function fetchUpdateLikeReview(reviewId) {
    const init = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + GlobalTokenID.token
        }
    };

    return fetch(`${BASE_URL}/review=${reviewId}&user=${GlobalTokenID.id}`, init);
}

export {
    fetchAddReview,
    fetchUpdateReview,
    fetchDeleteReview,
    fetchUpdateLikeReview
};
