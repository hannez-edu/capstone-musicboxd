const BASE_URL = "http://localhost:8080/api/catalog";

function fetchCatalogByUserId(userId) {
    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };

    return fetch(`${BASE_URL}/users/${userId}`, init);
}

function fetchAddCatalog(catalog) {
    const init = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
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
            "Content-Type": "application/json"
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
