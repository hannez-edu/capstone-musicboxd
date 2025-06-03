import { useState } from "react";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";

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

export default AlbumReviewFormStars;
