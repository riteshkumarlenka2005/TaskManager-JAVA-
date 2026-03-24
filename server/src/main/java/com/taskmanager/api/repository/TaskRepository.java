package com.taskmanager.api.repository;

import com.taskmanager.api.model.Task;
import com.taskmanager.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByCreatedAtDesc(User user);
    Optional<Task> findByIdAndUser(Long id, User user);
}
