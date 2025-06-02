package org.musicboxd.domain;

import org.musicboxd.data.CatalogRepository;
import org.musicboxd.models.Catalog;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CatalogService {
    private final CatalogRepository repository;

    public CatalogService(CatalogRepository repository) {
        this.repository = repository;
    }

    public List<Catalog> findAll() {return repository.findAll();}

    public Catalog findById(int catalogId) {return repository.findById(catalogId);}

    public List<Catalog> findByUserId(int userId) {return repository.findByUserId(userId);}

    public Result<Catalog> add(Catalog catalog) {
        Result<Catalog> result = validate(catalog);
        if (result.getType() != ResultType.SUCCESS) {
            return result;
        }

        try {
            Catalog added = repository.add(catalog);
            if (added == null) {
                result.addMessage("Failed to add catalog entry.", ResultType.INVALID);
                return result;
            }
            result.setPayload(added);
            return result;
        } catch (Exception e) {
            // Handle database constraint violations (like duplicate user/album)
            if (e.getMessage().contains("unique_user_album")) {
                result.addMessage("User already has this album in their catalog.", ResultType.INVALID);
            } else {
                result.addMessage("Database error: " + e.getMessage(), ResultType.INVALID);
            }
            return result;
        }
    }

    public Result<Catalog> update(Catalog catalog) {
        Result<Catalog> result = new Result<>();

        if (catalog.getCatalogEntryId() <= 0) {
            result.addMessage("Catalog entry ID is required for updates.", ResultType.INVALID);
            return result;
        }

        // Check if catalog entry exists
        Catalog existing = repository.findById(catalog.getCatalogEntryId());
        if (existing == null) {
            result.addMessage("Catalog entry not found.", ResultType.NOT_FOUND);
            return result;
        }

        Result<Catalog> validation = validate(catalog);
        if (validation.getType() != ResultType.SUCCESS) {
            return validation;
        }

        try {
            boolean updated = repository.update(catalog);
            if (!updated) {
                result.addMessage("Failed to update catalog entry.", ResultType.INVALID);
                return result;
            }
            result.setPayload(catalog);
            return result;
        } catch (Exception e) {
            result.addMessage("Database error: " + e.getMessage(), ResultType.INVALID);
            return result;
        }
    }

    public boolean deleteById(int catalogId) {return repository.deleteById(catalogId);}

    private Result<Catalog> validate(Catalog catalog) {
        Result<Catalog> result = new Result<>();

        if (catalog == null) {
            result.addMessage("Catalog entry cannot be null.", ResultType.INVALID);
            return result;
        }

        if (catalog.getUserId() <= 0) {
            result.addMessage("User ID is required.", ResultType.INVALID);
        }

        if (catalog.getAlbumId() <= 0) {
            result.addMessage("Album ID is required.", ResultType.INVALID);
        }

        if (catalog.getStatus() == null) {
            result.addMessage("Status is required.", ResultType.INVALID);
        }

        return result;
    }
}
