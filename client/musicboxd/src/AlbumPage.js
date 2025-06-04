import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import formatAlbumDate from "./album/formatAlbumDate";
import AlbumCatalogBar from "./album/AlbumCatalogBar";
import AlbumReviewForm from "./album/AlbumReviewForm";
import AlbumReview from "./album/AlbumReview";
import { fetchAlbumById } from "./album/fetchAlbum";
import { fetchCatalogByUserId } from "./album/fetchCatalog";

function AlbumPage({ currentUserId }) {
    const { id } = useParams();

    const [album, setAlbum] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [visibleReviews, setVisibleReviews] = useState([]);
    const [showMyReview, setShowMyReview] = useState(false);
    const [myReview, setMyReview] = useState(null);

    const [catalog, setCatalog] = useState(null);

    useEffect(() => {
        fetchAlbumById(id)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 404) {
                    return Promise.reject("Album not found.");
                } else {
                    return Promise.reject("Bad status code " + response.status);
                }
            })
            .then(data => {
                setAlbum(data);
                if (data.reviews) {
                    // If there are reviews, we should set up the useStates
                    setReviews(data.reviews.filter((rev) => rev.user.userId !== currentUserId));
                    setMyReview(data.reviews.find((rev) => rev.user.userId === currentUserId));
                }
                setShowMyReview(true);
            })
            .catch(console.log);
    }, [id, currentUserId]);

    useEffect(() => {
        fetchCatalogByUserId(currentUserId)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject("Bad status code " + response.status);
                }
            })
            .then(data => {
                setCatalog(data.find((cata) => cata.userId === currentUserId));
            })
            .catch(console.log);
    }, [currentUserId]);

    useEffect(() => {
        // For now, just grap the first 5 reviews to show to the user
        setVisibleReviews(reviews.slice(0, 5));
    }, [reviews]);

    function handleDelete(reviewId) {
        if (myReview && myReview.reviewId === reviewId) {
            setShowMyReview(false);
            setMyReview(null);
        } else {
            const newReviews = reviews.filter((rev) => rev.reviewId !== reviewId);
            setReviews(newReviews);
        }
    }

    return (
        <div className="d-flex flex-column gap-4">
            <section id="albums" className="d-flex flex-row gap-4 p-2">
                <div id="albumInfo" className="d-flex flex-column w-50 gap-2">
                    <h1>{album === null ? "Loading title..." : album.title}</h1>
                    <h3>{album === null ? "Loading artist..." : album.artist}</h3>
                    <h5>{album === null ? "MM/DD/YYYY" : formatAlbumDate(album.firstReleasedDate)}</h5>
                    {currentUserId > 0 && (
                        <AlbumCatalogBar catalog={catalog} currentUserId={currentUserId} albumId={album?.albumId} />
                    )}
                </div>
                <div id="albumImage" className="d-flex w-50 justify-content-center">
                    <img
                        className="img-fluid"
                        src={album?.artUrl}
                        alt="Album cover"
                        draggable="false"
                    />
                </div>
            </section>
            {currentUserId > 0 && (
            <section id="myReview">
                <h2>{myReview == null ? "Make A Review" : "Your Review"}</h2>
                {showMyReview && myReview != null ? (
                    <AlbumReview review={myReview} currentUserId={currentUserId} afterDelete={handleDelete} />
                ) : (
                    <AlbumReviewForm userId={currentUserId} albumId={album?.albumId} review={myReview} afterSubmit={(review) => {
                        setMyReview(review);
                        setShowMyReview(true);
                    }} />
                )}
            </section>    
            )}
            <section id="reviews">
                <h2>Reviews</h2>
                {visibleReviews.map((rev) => (
                    <div className="mb-4" key={rev.reviewId}>
                        <AlbumReview review={rev} currentUserId={currentUserId} afterDelete={handleDelete} />
                    </div>
                ))}
            </section>
        </div>
    );
}

export default AlbumPage;
