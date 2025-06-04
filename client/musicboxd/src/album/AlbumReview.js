import { useState } from "react";
import Likes from "./Likes";
import Stars from "./Stars";
import AlbumReviewForm from "./AlbumReviewForm";
import { fetchDeleteReview } from "./fetchReview";

function AlbumReview({ review, currentUserId, afterDelete }) {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [myReview, setMyReview] = useState(review);

    function handleDelete() {
        setDeleteInProgress(true);
        fetchDeleteReview(myReview.reviewId)
            .then(response => {
                if (response.status === 204) {
                    if (afterDelete) {
                        afterDelete(myReview.reviewId);
                    }
                } else {
                    setDeleteInProgress(false);
                    return Promise.reject("Bad status code " + response.status);
                }
            })
            .catch(console.log);
    }

    return (
        <>
        {editing ? (
            <AlbumReviewForm 
                review={myReview} 
                afterSubmit={(rev) => {
                    setEditing(false);
                    setMyReview(rev);
                }}
                onCancel={() => setEditing(false)}
            />
        ) : (
            <div className={`d-flex flex-column ${deleting && "border border-danger p-2"}`}>
                {deleting && (
                    <>
                        <h3 className="text-danger">Are you sure you want to delete the following review?</h3>
                        <div className="d-flex flex-row gap-2 mb-2">
                            <button type="button" className="btn btn-primary" onClick={() => handleDelete()} disabled={deleteInProgress}>Confirm</button>
                            <button type="button" className="btn btn-danger" onClick={() => setDeleting(false)} disabled={deleteInProgress}>Cancel</button>
                        </div>
                    </>
                )}
                <div name="review heading" className="d-flex flex-row justify-content-between">
                    <h5>{myReview?.user?.userName}</h5>
                    <Stars starCount={myReview.stars} />
                </div>
                <p name="review content">
                    {myReview.content}
                </p>
                <div className="d-flex justify-content-between">
                    <div className="d-inline-flex gap-2">
                        {!deleting && myReview?.userId === currentUserId && (
                            <button type="button" className="btn btn-danger" onClick={() => setDeleting(true)}>Delete</button>
                        )}
                        {!deleting && myReview?.userId === currentUserId && (
                            <button type="button" className="btn btn-warning" onClick={() => setEditing(true)}>Edit</button>
                        )}
                    </div>
                    <Likes likesCount={myReview.likes} isLiked={myReview.likedByCurrentUser} disableLiking={currentUserId == null || currentUserId <= 0 || deleting} />
                </div>
            </div>
        )}
        </>
    );
}

export default AlbumReview;
