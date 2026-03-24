package com.taskmanager.api.dto;

import com.taskmanager.api.model.Priority;
import com.taskmanager.api.model.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private Status status;
    
    private Priority priority;
    
    private LocalDateTime dueDate;
}
