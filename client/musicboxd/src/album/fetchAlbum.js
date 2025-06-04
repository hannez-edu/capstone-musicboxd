const BASE_URL = "http://localhost:8080/api/albums";

function fetchAlbumById(albumId, userId = 0) {
    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    };

    return fetch(`${BASE_URL}/album=${albumId}&user=${userId}`, init);
}

function fetchAddAlbum(album) {
    const init = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(album),
    };

    return fetch(`${BASE_URL}`, init);
}

export {
    fetchAlbumById,
    fetchAddAlbum
};
