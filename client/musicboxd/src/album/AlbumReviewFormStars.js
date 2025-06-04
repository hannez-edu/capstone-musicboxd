import { IoStarOutline, IoStarSharp } from "react-icons/io5";

function AlbumReviewFormStars({ onStarClick, starCount }) {

    function handleStars(num) {
        onStarClick(num);
    }

    return (
        <div className="d-flex flex-row" aria-label="a row of stars for making a review">
            <button
                className="btn shadow-none p-0"
                type="button"
                onClick={() => handleStars(1)}
            >
                {starCount >= 1 ? (
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
                {starCount >= 2 ? (
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
                {starCount >= 3 ? (
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
                {starCount >= 4 ? (
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
                {starCount >= 5 ? (
                    <IoStarSharp color="gold" size="30px"/>
                ) : (
                    <IoStarOutline size="30px" />
                )}
            </button>
        </div>
    );
}

export default AlbumReviewFormStars;
