package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.request.CreateCourseRequest;
import com.campusmate.entity.Course;
import com.campusmate.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
            .map(course -> ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", course)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody CreateCourseRequest request) {
        Course createdCourse = courseService.createCourseFromRequest(request);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", createdCourse));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@PathVariable String id, @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(id, course);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updatedCourse));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesBySubject(@PathVariable String subjectId) {
        List<Course> courses = courseService.getCoursesBySubject(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Courses by subject retrieved successfully", courses));
    }
    
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByProfessor(@PathVariable String professorId) {
        List<Course> courses = courseService.getCoursesByProfessor(professorId);
        return ResponseEntity.ok(ApiResponse.success("Courses by professor retrieved successfully", courses));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Course>>> getActiveCourses() {
        List<Course> courses = courseService.getActiveCourses();
        return ResponseEntity.ok(ApiResponse.success("Active courses retrieved successfully", courses));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Course>>> searchCourses(@RequestParam String keyword) {
        List<Course> courses = courseService.searchCourses(keyword);
        return ResponseEntity.ok(ApiResponse.success("Courses search completed successfully", courses));
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Course>>> getAvailableCourses() {
        List<Course> courses = courseService.getAvailableCourses();
        return ResponseEntity.ok(ApiResponse.success("Available courses retrieved successfully", courses));
    }
}
