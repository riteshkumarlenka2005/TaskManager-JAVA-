package com.ritesh.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
private TaskService taskService;

    // GET all tasks
    @GetMapping
public List<Task> getAllTasks() {
    return taskService.getAllTasks();
}

    // POST create new task
    @PostMapping
public Task createTask(@RequestBody Task task) {
    return taskService.createTask(task);
}

    // UPDATE task
@PutMapping("/{id}")
public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
    return taskService.updateTask(id, task);
}

// DELETE task
@DeleteMapping("/{id}")
public String deleteTask(@PathVariable Long id) {
    taskRepository.deleteById(id);
    return "Task deleted successfully";
}




}