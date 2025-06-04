import { GlobalTokenID } from "../Login";

const BASE_URL = "http://localhost:8080/api/albums";

function fetchAlbumById(albumId) {
    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    };

    return fetch(`${BASE_URL}/album=${albumId}&user=${GlobalTokenID?.id != null ? GlobalTokenID.id : 0}`, init);
}

function fetchAddAlbum(album) {
    const init = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GlobalTokenID.token
        },
        body: JSON.stringify(album),
    };

    return fetch(`${BASE_URL}`, init);
}

function fetchDeleteAlbum(albumId) {
    const init = {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + GlobalTokenID.token
        },
    };

    return fetch(`${BASE_URL}/${albumId}`, init);
}

export {
    fetchAlbumById,
    fetchAddAlbum,
    fetchDeleteAlbum
};
