package com.campusmate.service;

import com.campusmate.entity.Course;
import com.campusmate.entity.Subject;
import com.campusmate.entity.User;
import com.campusmate.repository.CourseRepository;
import com.campusmate.repository.SubjectRepository;
import com.campusmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }
    
    public Course createCourse(Course course) {
        course.setId(UUID.randomUUID().toString());
        return courseRepository.save(course);
    }
    
    public Course updateCourse(String id, Course courseDetails) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCredits(courseDetails.getCredits());
        course.setMaxStudents(courseDetails.getMaxStudents());
        course.setIsActive(courseDetails.getIsActive());
        
        return courseRepository.save(course);
    }
    
    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
    
    public List<Course> getCoursesBySubject(String subjectId) {
        return courseRepository.findBySubjectId(subjectId);
    }
    
    public List<Course> getCoursesByProfessor(String professorId) {
        return courseRepository.findByProfessorId(professorId);
    }
    
    public List<Course> getActiveCourses() {
        return courseRepository.findByIsActiveTrue();
    }
    
    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchByKeyword(keyword);
    }
    
    public List<Course> getAvailableCourses() {
        return courseRepository.findAvailableCourses();
    }
}
