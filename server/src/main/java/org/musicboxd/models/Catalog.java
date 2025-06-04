package org.musicboxd.models;

public class Catalog {
    private int catalogEntryId;
    private int userId;
    private int albumId;
    private CatalogStatus status;

    public int getCatalogEntryId() {
        return catalogEntryId;
    }

    public void setCatalogEntryId(int catalogEntryId) {
        this.catalogEntryId = catalogEntryId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getAlbumId() {
        return albumId;
    }

    public void setAlbumId(int albumId) {
        this.albumId = albumId;
    }

    public CatalogStatus getStatus() {
        return status;
    }

    public void setStatus(CatalogStatus status) {
        this.status = status;
    }
}
