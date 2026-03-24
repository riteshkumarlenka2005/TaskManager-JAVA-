package com.taskmanager.api.service;

import com.taskmanager.api.dto.TaskRequest;
import com.taskmanager.api.model.Task;
import com.taskmanager.api.model.User;
import com.taskmanager.api.repository.TaskRepository;
import com.taskmanager.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> getAllTasks(String username) {
        User user = getUserByUsername(username);
        return taskRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Task getTaskById(Long id, String username) {
        User user = getUserByUsername(username);
        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found or doesn't belong to you"));
    }

    public Task createTask(TaskRequest request, String username) {
        User user = getUserByUsername(username);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request, String username) {
        Task task = getTaskById(id, username);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id, String username) {
        Task task = getTaskById(id, username);
        taskRepository.delete(task);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
