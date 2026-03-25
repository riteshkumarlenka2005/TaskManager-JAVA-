package com.taskmanager.api.controller;

import com.taskmanager.api.dto.DocumentRequest;
import com.taskmanager.api.model.Document;
import com.taskmanager.api.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments(Authentication authentication) {
        return ResponseEntity.ok(documentService.getAllDocuments(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(documentService.getDocumentById(id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Document> createDocument(@Valid @RequestBody DocumentRequest request, Authentication authentication) {
        return ResponseEntity.ok(documentService.createDocument(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody DocumentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.updateDocument(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id, Authentication authentication) {
        documentService.deleteDocument(id, authentication.getName());
        return ResponseEntity.ok("Document deleted successfully");
    }
}
