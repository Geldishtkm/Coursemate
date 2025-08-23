package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.entity.Subject;
import com.campusmate.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
    
    @Autowired
    private SubjectService subjectService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Subject>>> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved successfully", subjects));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> getSubjectById(@PathVariable String id) {
        return subjectService.getSubjectById(id)
            .map(subject -> ResponseEntity.ok(ApiResponse.success("Subject retrieved successfully", subject)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Subject>> createSubject(@RequestBody Subject subject) {
        Subject createdSubject = subjectService.createSubject(subject);
        return ResponseEntity.ok(ApiResponse.success("Subject created successfully", createdSubject));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> updateSubject(@PathVariable String id, @RequestBody Subject subject) {
        Subject updatedSubject = subjectService.updateSubject(id, subject);
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", updatedSubject));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable String id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<ApiResponse<List<Subject>>> getSubjectsByDepartment(@PathVariable String department) {
        List<Subject> subjects = subjectService.getSubjectsByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success("Subjects by department retrieved successfully", subjects));
    }
    
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<ApiResponse<List<Subject>>> getSubjectsByDifficulty(@PathVariable String difficulty) {
        List<Subject> subjects = subjectService.getSubjectsByDifficulty(difficulty);
        return ResponseEntity.ok(ApiResponse.success("Subjects by difficulty retrieved successfully", subjects));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Subject>>> searchSubjects(@RequestParam String keyword) {
        List<Subject> subjects = subjectService.searchSubjects(keyword);
        return ResponseEntity.ok(ApiResponse.success("Subjects search completed successfully", subjects));
    }
    
    @GetMapping("/credits/{credits}")
    public ResponseEntity<ApiResponse<List<Subject>>> getSubjectsByCredits(@PathVariable Integer credits) {
        List<Subject> subjects = subjectService.getSubjectsByCredits(credits);
        return ResponseEntity.ok(ApiResponse.success("Subjects by credits retrieved successfully", subjects));
    }
    
    @GetMapping("/prerequisite/{prerequisite}")
    public ResponseEntity<ApiResponse<List<Subject>>> getSubjectsByPrerequisite(@PathVariable String prerequisite) {
        List<Subject> subjects = subjectService.getSubjectsByPrerequisite(prerequisite);
        return ResponseEntity.ok(ApiResponse.success("Subjects by prerequisite retrieved successfully", subjects));
    }
}
