import { useState } from "react";

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

export default AlbumCatalogBar;
