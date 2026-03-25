package com.taskmanager.api.repository;

import com.taskmanager.api.model.Document;
import com.taskmanager.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserOrderByUpdatedAtDesc(User user);
    Optional<Document> findByIdAndUser(Long id, User user);
}
