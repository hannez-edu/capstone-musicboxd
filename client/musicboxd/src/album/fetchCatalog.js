import { GlobalTokenID } from "../Login";

const BASE_URL = "http://localhost:8080/api/catalog";

function fetchCatalogByUserId() {
    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + GlobalTokenID.token
        }
    };
    
    return fetch(`${BASE_URL}/users/${GlobalTokenID?.id != null ? GlobalTokenID.id : 0}`, init);
}

function fetchAddCatalog(catalog) {
    const init = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GlobalTokenID.token
        },
        body: JSON.stringify(catalog)
    };

    return fetch(`${BASE_URL}`, init);
}

function fetchUpdateCatalog(catalog) {
    const init = {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GlobalTokenID.token
        },
        body: JSON.stringify(catalog)
    };

    return fetch(`${BASE_URL}/${catalog.catalogEntryId}`, init);
}

export {
    fetchCatalogByUserId,
    fetchAddCatalog,
    fetchUpdateCatalog
};
