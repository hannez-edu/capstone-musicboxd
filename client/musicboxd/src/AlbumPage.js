import { useState } from "react";
import { useParams } from "react-router-dom";
import formatAlbumDate from "./album/formatAlbumDate";
import AlbumCatalogBar from "./album/AlbumCatalogBar";
import AlbumReviewForm from "./album/AlbumReviewForm";
import AlbumReview from "./album/AlbumReview";
import Likes from "./album/Likes";

const TEMP_ALBUM = {
    title: "Test Album",
    artist: "Artist",
    firstReleasedDate: "2020-01-01",
    artUrl: "https://picsum.photos/id/77/500/500"
};

const TEMP_REVIEW = {
    user: {
        userName: "User Name"
    },
    content: "Sed et tincidunt tellus. Sed mollis libero massa, at fringilla purus porttitor eu. Sed consequat arcu nunc, sit amet blandit nulla elementum ut. Vivamus at vestibulum lorem. Nunc leo nulla, semper ac eros sed, pharetra laoreet quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida nisl non diam dignissim sagittis. Etiam nec odio lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus magna quis neque aliquam, sit amet luctus nisl feugiat. Praesent non metus accumsan, imperdiet leo quis, rutrum dui. Maecenas gravida mollis sodales. Nullam commodo elementum eros, quis euismod orci consequat vel. Etiam lorem diam, efficitur nec diam id, facilisis elementum lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    stars: 3,
    likes: 10,
    likedByCurrentUser: false
};

function AlbumPage() {
    const { id } = useParams();
    const [album, setAlbum] = useState(TEMP_ALBUM);
    const [reviews, setReviews] = useState([]);
    const [visibleReviews, setVisibleReviews] = useState([]);
    const [myReview, setMyReview] = useState(null);

    return (
        <div>
            <section id="albums" className="d-flex flex-row gap-4">
                <div id="albumInfo" className="d-flex flex-column w-50 gap-2 p-2">
                    <h1>{album === null ? "Loading title..." : album.title}</h1>
                    <h3>{album === null ? "Loading artist..." : album.artist}</h3>
                    <h5>{album === null ? "MM/DD/YYYY" : formatAlbumDate(album.firstReleasedDate)}</h5>
                    <AlbumCatalogBar />
                </div>
                <div id="albumImage" className="w-50">
                    <img
                        className="w-100"
                        src={album === null || isEmptyString(album.artUrl) ? "" : album.artUrl}
                        alt="Album cover"
                    />
                </div>
            </section>
            <section id="myReview">
                <h2>Your Review</h2>
                <AlbumReviewForm />
            </section>
            <section id="reviews">
                <h2>Reviews</h2>
                <AlbumReview review={TEMP_REVIEW} />
                <div className="d-flex justify-content-end">
                    <Likes likesCount={TEMP_REVIEW.likes} isLiked={TEMP_REVIEW.likedByCurrentUser} />
                </div>
            </section>
        </div>
    );
}

function isEmptyString(str) {
    return str === null || str === undefined || str.trim() === "";
}

export default AlbumPage;
