package org.musicboxd.controllers;

import org.musicboxd.domain.CatalogService;
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
    public List<Catalog> findAll() {return service.findAll();}

    @GetMapping("/{catalogId}")
    public ResponseEntity<Catalog> findById(@PathVariable int catalogId) {
        Catalog catalog = service.findById(catalogId);
        if (catalog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(catalog);
    }

    @PostMapping
    public ResponseEntity<Catalog> add(@RequestBody Catalog catalog) {
        return null;
    }

    @PutMapping
    public ResponseEntity<Catalog> update(@PathVariable int catalogId, @RequestBody Catalog catalog) {
        return null;
    }

    @DeleteMapping
    public ResponseEntity<Catalog> deleteById(@PathVariable int catalogId) {
        return null;
    }
}
