package com.taskmanager.api.service;

import com.taskmanager.api.dto.DocumentRequest;
import com.taskmanager.api.model.Document;
import com.taskmanager.api.model.User;
import com.taskmanager.api.repository.DocumentRepository;
import com.taskmanager.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public List<Document> getAllDocuments(String username) {
        User user = getUserByUsername(username);
        return documentRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    public Document getDocumentById(Long id, String username) {
        User user = getUserByUsername(username);
        return documentRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Document not found or doesn't belong to you"));
    }

    public Document createDocument(DocumentRequest request, String username) {
        User user = getUserByUsername(username);

        Document document = Document.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .build();

        return documentRepository.save(document);
    }

    public Document updateDocument(Long id, DocumentRequest request, String username) {
        Document document = getDocumentById(id, username);

        document.setTitle(request.getTitle());
        if (request.getContent() != null) {
            document.setContent(request.getContent());
        }

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id, String username) {
        Document document = getDocumentById(id, username);
        documentRepository.delete(document);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
