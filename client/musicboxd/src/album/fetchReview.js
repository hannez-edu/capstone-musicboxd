import { GlobalTokenID } from "../Login";

const BASE_URL = "http://localhost:8080/api/reviews";

function fetchReviewById(reviewId) {
    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    };

    return fetch(`${BASE_URL}/review=${reviewId}&user=${GlobalTokenID.id == null ? 0 : GlobalTokenID.id}`, init);
}

function fetchLatestReviews(latestCount) {
    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };

    return fetch(`${BASE_URL}/latestCount=${latestCount}&user=${GlobalTokenID.id == null ? 0 : GlobalTokenID.id}`, init);
}

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

    return fetch(`${BASE_URL}/review=${reviewId}&user=${GlobalTokenID.id == null ? 0 : GlobalTokenID.id}`, init);
}

export {
    fetchAddReview,
    fetchUpdateReview,
    fetchDeleteReview,
    fetchUpdateLikeReview,
    fetchReviewById,
    fetchLatestReviews
};
