import { useEffect, useState } from "react";
import { fetchAddCatalog, fetchUpdateCatalog } from "./fetchCatalog";
import { GlobalTokenID } from "../Login";

function AlbumCatalogBar({ catalog, albumId }) {
    const [selection, setSelection] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [myCatalog, setMyCatalog] = useState(catalog);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (catalog != null) {
            setMyCatalog(catalog);
            setSelection(catalog.status);
        }
    }, [catalog, albumId]);

    function handleChange(event) {
        if (submitting) {
            return;
        }
        
        setSelection(event.target.name);
        setSubmitting(true);

        if (GlobalTokenID.id == null || GlobalTokenID.token == null) {
            setSubmitting(false);
            setErrors(["Only logged in users can use catalog feature."]);
        }

        if (myCatalog == null) {
            // Need to create a new catalog
            const newCatalog = {
                albumId: albumId,
                userId: GlobalTokenID.id,
                status: event.target.name
            };

            fetchAddCatalog(newCatalog)
                .then(response => {
                    setSubmitting(false);
                    if (response.status === 201 || response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject("Bad status code " + response.status);
                    }
                })
                .then(data => {
                    if (data.catalogEntryId) {
                        setMyCatalog(data);
                    } else {
                        setErrors(data);
                    }
                })
                .catch(console.log);
        } else {
            // Need to update an existing catalog
            const newCatalog = {
                catalogEntryId: myCatalog.catalogEntryId,
                albumId: myCatalog.albumId,
                userId: myCatalog.userId,
                status: event.target.name
            };

            fetchUpdateCatalog(newCatalog)
                .then(response => {
                    setSubmitting(false);
                    if (response.status === 200) {
                        return null;
                    } else if (response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject("Bad status code " + response.status);
                    }
                })
                .then(data => {
                    if (data == null) {
                        setMyCatalog(newCatalog);
                    } else {
                        setErrors(data);
                    }
                })
                .catch(console.log);
        }
    }

    return (
        <>
        {errors.length > 0 && (
            <div className="text-danger">
                <p>The following errors occurred with catalogs:</p>
                <ul>
                    {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            </div>
        )}
        <div className="btn-group">
            <button 
                type="button" 
                name="LISTENED"
                className={`btn btn-outline-primary shadow-none ${selection === "LISTENED" ? "active" : ""}`}
                aria-pressed={selection === "LISTENED"}
                onClick={(event) => handleChange(event)}
                disabled={albumId == null}
            >
                Listened
            </button>
            <button 
                type="button"
                name="WANT_TO_LISTEN"
                className={`btn btn-outline-primary shadow-none ${selection === "WANT_TO_LISTEN" ? "active" : ""}`}
                aria-pressed={selection === "WANT_TO_LISTEN"}
                onClick={(event) => handleChange(event)}
                disabled={albumId == null}
            >
                Want to Listen
            </button>
            <button 
                type="button" 
                name="NO_INTEREST"
                className={`btn btn-outline-primary shadow-none ${selection === "NO_INTEREST" ? "active" : ""}`}
                aria-pressed={selection === "NO_INTEREST"}
                onClick={(event) => handleChange(event)}
                disabled={albumId == null}
            >
                No Interest
            </button>
        </div>
        </>
    );
}

export default AlbumCatalogBar;
