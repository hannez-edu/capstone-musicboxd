package org.musicboxd.domain;

import org.junit.jupiter.api.Test;
import org.musicboxd.data.CatalogRepository;
import org.musicboxd.models.Catalog;
import org.musicboxd.models.CatalogStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class CatalogServiceTest {

    @Autowired
    CatalogService service;

    @MockBean
    CatalogRepository repository;

    @Test
    void shouldFindAll(){
        List<Catalog> expected = List.of(makeCatalog(), makeCatalog(), makeCatalog());
        when(repository.findAll()).thenReturn(expected);

        List<Catalog> result = service.findAll();

        assertEquals(expected, result);
        assertEquals(3, result.size());
        verify(repository).findAll();
    }

    @Test
    void shouldFindById() {
        Catalog expected = makeCatalog();
        when(repository.findById(1)).thenReturn(expected);

        Catalog result = service.findById(1);

        assertEquals(expected, result);
        verify(repository).findById(1);
    }

    @Test
    void shouldReturnNullWhenCatalogNotFound() {
        when(repository.findById(999)).thenReturn(null);

        Catalog result = service.findById(999);

        assertNull(result);
        verify(repository).findById(999);
    }

    @Test
    void shouldFindByUserId() {
        List<Catalog> expected = List.of(makeCatalog(), makeCatalog());
        when(repository.findByUserId(1)).thenReturn(expected);

        List<Catalog> result = service.findByUserId(1);

        assertEquals(expected, result);
        verify(repository).findByUserId(1);
    }

    @Test
    void shouldAddValidCatalog() {
        Catalog catalog = makeCatalog();
        Catalog savedCatalog = makeCatalog();
        savedCatalog.setCatalogEntryId(1);

        when(repository.add(catalog)).thenReturn(savedCatalog);

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(savedCatalog, result.getPayload());
        assertTrue(result.getMessages().isEmpty());
        verify(repository).add(catalog);
    }

    @Test
    void shouldNotAddNullCatalog() {
        Result<Catalog> result = service.add(null);

        assertEquals(ResultType.INVALID, result.getType());
        assertNull(result.getPayload());
        assertTrue(result.getMessages().contains("Catalog entry cannot be null."));
        verify(repository, never()).add(any());
    }

    @Test
    void shouldNotAddCatalogWithInvalidUserId() {
        Catalog catalog = makeCatalog();
        catalog.setUserId(0);

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertNull(result.getPayload());
        assertTrue(result.getMessages().contains("User ID is required."));
        verify(repository, never()).add(any());
    }

    @Test
    void shouldNotAddCatalogWithInvalidAlbumId() {
        Catalog catalog = makeCatalog();
        catalog.setAlbumId(0);

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Album ID is required."));
        verify(repository, never()).add(any());
    }

    @Test
    void shouldNotAddCatalogWithNullStatus() {
        Catalog catalog = makeCatalog();
        catalog.setStatus(null);

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Status is required."));
        verify(repository, never()).add(any());
    }

    @Test
    void shouldReturnMultipleValidationErrors() {
        Catalog catalog = new Catalog();
        catalog.setCatalogEntryId(0);
        catalog.setUserId(0);
        catalog.setAlbumId(0);
        catalog.setStatus(null);

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertEquals(3, result.getMessages().size());
        assertTrue(result.getMessages().contains("User ID is required."));
        assertTrue(result.getMessages().contains("Album ID is required."));
        assertTrue(result.getMessages().contains("Status is required."));
        verify(repository, never()).add(any());
    }

    @Test
    void shouldNotAddWhenRepositoryFails() {
        Catalog catalog = makeCatalog();
        when(repository.add(catalog)).thenReturn(null);

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Failed to add catalog entry."));
        verify(repository).add(catalog);
    }

    @Test
    void shouldNotAddDuplicateUserAlbum() {
        Catalog catalog = makeCatalog();
        when(repository.add(catalog)).thenThrow(new RuntimeException("unique_user_album constraint violation"));

        Result<Catalog> result = service.add(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("User already has this album in their catalog."));
        verify(repository).add(catalog);
    }

    @Test
    void shouldUpdateValidCatalog() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(1);

        when(repository.findById(1)).thenReturn(catalog);
        when(repository.update(catalog)).thenReturn(true);

        Result<Catalog> result = service.update(catalog);

        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(catalog, result.getPayload());
        assertTrue(result.getMessages().isEmpty());
        verify(repository).findById(1);
        verify(repository).update(catalog);
    }

    @Test
    void shouldNotUpdateWithoutId() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(0);

        Result<Catalog> result = service.update(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Catalog entry ID is required for updates."));
        verify(repository, never()).findById(anyInt());
        verify(repository, never()).update(any());
    }

    @Test
    void shouldNotUpdateWithoutUserId() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(1);
        catalog.setUserId(0);

        when(repository.findById(1)).thenReturn(makeCatalog());

        Result<Catalog> result = service.update(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("User ID is required."));
        verify(repository).findById(1);
        verify(repository, never()).update(any());
    }

    @Test
    void shouldNotUpdateNonExistentCatalog() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(999);

        when(repository.findById(999)).thenReturn(null);

        Result<Catalog> result = service.update(catalog);

        assertEquals(ResultType.NOT_FOUND, result.getType());
        assertTrue(result.getMessages().contains("Catalog entry not found."));
        verify(repository).findById(999);
        verify(repository, never()).update(any());
    }

    @Test
    void shouldHandleUpdateFailure() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(1);

        when(repository.findById(1)).thenReturn(catalog);
        when(repository.update(catalog)).thenReturn(false);

        Result<Catalog> result = service.update(catalog);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Failed to update catalog entry."));
        verify(repository).findById(1);
        verify(repository).update(catalog);
    }

    @Test
    void shouldDeleteById() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(1);

        when(repository.findById(1)).thenReturn(catalog);
        when(repository.deleteById(1)).thenReturn(true);

        Result<Catalog> result = service.deleteById(1);

        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(catalog, result.getPayload());
        assertTrue(result.getMessages().isEmpty());
        verify(repository).findById(1);
        verify(repository).deleteById(1);
    }

    @Test
    void shouldNotDeleteNonExistentCatalog() {
        when(repository.findById(999)).thenReturn(null);

        Result<Catalog> result = service.deleteById(999);

        assertEquals(ResultType.NOT_FOUND, result.getType());
        assertTrue(result.getMessages().contains("Catalog entry not found."));
        verify(repository).findById(999);
        verify(repository, never()).deleteById(anyInt());
    }

    @Test
    void shouldHandleDeleteFailure() {
        Catalog catalog = makeCatalog();
        catalog.setCatalogEntryId(1);

        when(repository.findById(1)).thenReturn(catalog);
        when(repository.deleteById(1)).thenReturn(false);

        Result<Catalog> result = service.deleteById(1);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Failed to delete catalog entry."));
        verify(repository).findById(1);
        verify(repository).deleteById(1);
    }

    private Catalog makeCatalog() {
        Catalog catalog = new Catalog();
        catalog.setCatalogEntryId(0); // Will be set by repository
        catalog.setUserId(1);
        catalog.setAlbumId(1);
        catalog.setStatus(CatalogStatus.WANT_TO_LISTEN);
        return catalog;
    }
}
