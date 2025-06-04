import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

function Likes({ likesCount, isLiked, disableLiking = false }) {
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
                disabled={disableLiking}
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
