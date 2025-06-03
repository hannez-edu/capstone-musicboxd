import { IoStarOutline, IoStarSharp } from "react-icons/io5";

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

export default Stars;
