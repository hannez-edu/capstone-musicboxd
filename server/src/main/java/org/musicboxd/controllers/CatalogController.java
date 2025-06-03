package org.musicboxd.controllers;

import org.musicboxd.domain.CatalogService;
import org.musicboxd.domain.Result;
import org.musicboxd.domain.ResultType;
import org.musicboxd.models.Catalog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CatalogService service;

    public CatalogController(CatalogService service) {this.service = service;}

    @GetMapping
    public List<Catalog> findAll() {
        return service.findAll();
    }

    @GetMapping("/{catalogId}")
    public ResponseEntity<Catalog> findById(@PathVariable int catalogId) {
        Catalog catalog = service.findById(catalogId);
        if (catalog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(catalog);
    }

    @GetMapping("/users/{userId}")
    public List<Catalog> findByUserId(@PathVariable int userId) {
        return service.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Catalog catalog) {
        Result<Catalog> result = service.add(catalog);
        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/{catalogId}")
    public ResponseEntity<Object> update(@PathVariable int catalogId, @RequestBody Catalog catalog) {
        catalog.setCatalogEntryId(catalogId);
        Result<Catalog> result = service.update(catalog);

        if (result.getType() == ResultType.SUCCESS) {
            return ResponseEntity.ok(result.getPayload());
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/{catalogId}")
    public ResponseEntity<Object> deleteById(@PathVariable int catalogId) {
        Result<Catalog> result = service.deleteById(catalogId);

        if (result.getType() == ResultType.SUCCESS) {
            return ResponseEntity.ok(result.getPayload());
        }
        return ErrorResponse.build(result);
    }
}
