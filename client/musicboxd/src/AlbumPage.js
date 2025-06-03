import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";

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

function formatAlbumDate(dateStr = "1970-01-01") {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = (1 + date.getDay()).toString().padStart(2, "0");
    
    return `${month}/${day}/${year}`;
}

function isEmptyString(str) {
    return str === null || str === undefined || str.trim() === "";
}

function AlbumCatalogBar() {
    const [selection, setSelection] = useState("");

    function handleChange(event) {
        setSelection(event.target.name);
    }

    return (
        <div className="btn-group">
            <button 
                type="button" 
                name="Listened"
                className={`btn btn-outline-primary shadow-none ${selection === "Listened" ? "active" : ""}`}
                aria-pressed={selection === "Listened"}
                onClick={(event) => handleChange(event)}
            >
                Listened
            </button>
            <button 
                type="button"
                name="Want to Listen"
                className={`btn btn-outline-primary shadow-none ${selection === "Want to Listen" ? "active" : ""}`}
                aria-pressed={selection === "Want to Listen"}
                onClick={(event) => handleChange(event)}
            >
                Want to Listen
            </button>
            <button 
                type="button" 
                name="Not Interested"
                className={`btn btn-outline-primary shadow-none ${selection === "Not Interested" ? "active" : ""}`}
                aria-pressed={selection === "Not Interested"}
                onClick={(event) => handleChange(event)}
            >
                Not Interested
            </button>
        </div>
    );
}

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

function Stars({ starCount }) {
    return (
        <div className="d-flex flex-row" aria-label="a row of stars">
            {starCount >= 1 ? (
                <IoStarSharp color="gold" size="30px"/>
            ) : (
                <IoStarOutline size="30px" />
            )}
            {starCount >= 2 ? (
                <IoStarSharp color="gold" size="30px"/>
            ) : (
                <IoStarOutline size="30px" />
            )}
            {starCount >= 3 ? (
                <IoStarSharp color="gold" size="30px"/>
            ) : (
                <IoStarOutline size="30px" />
            )}
            {starCount >= 4 ? (
                <IoStarSharp color="gold" size="30px"/>
            ) : (
                <IoStarOutline size="30px" />
            )}
            {starCount >= 5 ? (
                <IoStarSharp color="gold" size="30px"/>
            ) : (
                <IoStarOutline size="30px" />
            )}
        </div>
    );
}

function Likes({ likesCount, isLiked }) {
    const [likes, setLikes] = useState(likesCount);
    const [liked, setLiked] = useState(isLiked);

    function handleLike() {
        if (liked) {
            setLiked(false);
            setLikes(likes - 1);
        } else {
            setLiked(true);
            setLikes(likes + 1);
        }
    }

    return (
        <div>
            <button
                className="d-flex flex-row gap-2 btn shadow-none"
                onClick={() => handleLike()}
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

function AlbumReviewFormStars({ onStarClick, starCount }) {
    const [stars, setStars] = useState(starCount);

    function handleStars(num) {
        setStars(num);
        onStarClick(num);
    }

    return (
        <div className="d-flex flex-row" aria-label="a row of stars for making a review">
            <button
                className="btn shadow-none p-0"
                type="button"
                onClick={() => handleStars(1)}
            >
                {stars >= 1 ? (
                    <IoStarSharp color="gold" size="30px"/>
                ) : (
                    <IoStarOutline size="30px" />
                )}
            </button>
            <button
                className="btn shadow-none p-0"
                type="button"
                onClick={() => handleStars(2)}
            >
                {stars >= 2 ? (
                    <IoStarSharp color="gold" size="30px"/>
                ) : (
                    <IoStarOutline size="30px" />
                )}
            </button>
            <button
                className="btn shadow-none p-0"
                type="button"
                onClick={() => handleStars(3)}
            >
                {stars >= 3 ? (
                    <IoStarSharp color="gold" size="30px"/>
                ) : (
                    <IoStarOutline size="30px" />
                )}
            </button>
            <button
                className="btn shadow-none p-0"
                type="button"
                onClick={() => handleStars(4)}
            >
                {stars >= 4 ? (
                    <IoStarSharp color="gold" size="30px"/>
                ) : (
                    <IoStarOutline size="30px" />
                )}
            </button>
            <button
                className="btn shadow-none p-0"
                type="button"
                onClick={() => handleStars(5)}
            >
                {stars >= 5 ? (
                    <IoStarSharp color="gold" size="30px"/>
                ) : (
                    <IoStarOutline size="30px" />
                )}
            </button>
        </div>
    );
}

export default AlbumPage;
