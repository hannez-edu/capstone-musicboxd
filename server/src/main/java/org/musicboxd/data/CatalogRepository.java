package org.musicboxd.data;

import org.musicboxd.models.Catalog;

import java.util.List;

public interface CatalogRepository {
    List<Catalog> findAll();

    Catalog findById(int catalogId);

    List<Catalog> findByUserId(int userId);

    Catalog add(Catalog catalog);

    boolean update(Catalog catalog);

    boolean deleteById(int catalogId);
}
