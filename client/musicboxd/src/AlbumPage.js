import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import formatAlbumDate from "./album/formatAlbumDate";
import AlbumCatalogBar from "./album/AlbumCatalogBar";
import AlbumReviewForm from "./album/AlbumReviewForm";
import AlbumReview from "./album/AlbumReview";
import { fetchAlbumById } from "./album/fetchAlbum";
import { fetchCatalogByUserId } from "./album/fetchCatalog";
import { GlobalTokenID } from "./Login";

function AlbumPage() {
    const { id } = useParams();
    const currentUserId = GlobalTokenID?.id == null ? 0 : GlobalTokenID.id;

    const [album, setAlbum] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [visibleReviews, setVisibleReviews] = useState([]);
    const [showMyReview, setShowMyReview] = useState(false);
    const [myReview, setMyReview] = useState(null);

    const [catalog, setCatalog] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAlbumById(id)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 404) {
                    return Promise.reject(response.status);
                } else {
                    return Promise.reject("Bad status code " + response.status);
                }
            })
            .then(data => {
                setAlbum(data);
                if (data.reviews) {
                    // If there are reviews, we should set up the useStates
                    setReviews(data.reviews.filter((rev) => rev.user.userId !== currentUserId).sort((a, b) => b.likes - a.likes));
                    setMyReview(data.reviews.find((rev) => rev.user.userId === currentUserId));
                }
                setShowMyReview(true);
            })
            .catch(err => {
                if (err === 404) {
                    navigate("/album-not-found");
                }
            });
    }, [id, currentUserId, navigate]);

    useEffect(() => {
        if (currentUserId > 0) {
            fetchCatalogByUserId()
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 403 || response.status === 401) {
                        return null;
                    } else {
                        return Promise.reject("Bad status code " + response.status);
                    }
                })
                .then(data => {
                    if (data) {
                        setCatalog(data.find((cata) => cata.userId === currentUserId));
                    }
                })
                .catch(console.log);
        }
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
                    <h5>{album === null ? "MM/DD/YYYY" : formatAlbumDate(album.firstReleaseDate)}</h5>
                    {currentUserId > 0 && (
                        <AlbumCatalogBar catalog={catalog} albumId={album?.albumId} />
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
                    <AlbumReview review={myReview} afterDelete={handleDelete} />
                ) : (
                    <AlbumReviewForm albumId={album?.albumId} review={myReview} afterSubmit={(review) => {
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
                        <AlbumReview review={rev} afterDelete={handleDelete} />
                    </div>
                ))}
            </section>
        </div>
    );
}

export default AlbumPage;
