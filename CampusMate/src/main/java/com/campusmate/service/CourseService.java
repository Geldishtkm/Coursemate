package com.campusmate.service;

import com.campusmate.entity.Course;
import com.campusmate.entity.Subject;
import com.campusmate.entity.User;
import com.campusmate.entity.CourseMaterial;
import com.campusmate.dto.request.CreateCourseRequest;
import com.campusmate.enums.UserRole;
import com.campusmate.enums.MaterialType;
import com.campusmate.repository.CourseRepository;
import com.campusmate.repository.SubjectRepository;
import com.campusmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Transactional
    public Course createCourseFromRequest(CreateCourseRequest request) {
        // Find subject
        Subject subject = subjectRepository.findById(request.getSubjectId())
            .orElseThrow(() -> new RuntimeException("Subject not found with id: " + request.getSubjectId()));
        
        // Create professor user
        User professor = createProfessorUser(request.getProfessorName());
        professor = userRepository.save(professor);

        // Create course
        Course course = createCourseEntity(request, subject, professor);
        course = courseRepository.save(course);

        // Create course materials from resources if provided
        if (request.getResources() != null && !request.getResources().isEmpty()) {
            List<CourseMaterial> materials = createCourseMaterials(request.getResources(), course, professor);
            course.getMaterials().addAll(materials);
        }

        return course;
    }

    private User createProfessorUser(String professorName) {
        User professor = new User();
        professor.setFirstName(professorName.split(" ")[0]); // First name
        professor.setLastName(professorName.contains(" ") ? 
            professorName.substring(professorName.indexOf(" ") + 1) : ""); // Last name
        professor.setEmail("professor@" + professorName.toLowerCase().replace(" ", "") + ".edu");
        professor.setRole(UserRole.TUTOR);
        professor.setIsActive(true);
        return professor;
    }

    private Course createCourseEntity(CreateCourseRequest request, Subject subject, User professor) {
        Course course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription() != null ? request.getDescription() : "");
        course.setSubject(subject);
        course.setProfessor(professor);
        course.setSemester(request.getSemester() != null ? request.getSemester() : "Fall 2024");
        course.setYear(request.getYear() != null ? request.getYear() : "2024");
        course.setCredits(request.getCredits() != null ? request.getCredits() : 3);
        course.setMaxStudents(request.getMaxStudents() != null ? request.getMaxStudents() : 50);
        course.setDifficultyLevel(request.getDifficultyLevel());
        course.setIsActive(true);
        return course;
    }

    private List<CourseMaterial> createCourseMaterials(List<CreateCourseRequest.CourseResourceRequest> resources, Course course, User professor) {
        return resources.stream()
            .map(resourceRequest -> {
                CourseMaterial material = new CourseMaterial();
                material.setTitle(resourceRequest.getTitle());
                material.setDescription(resourceRequest.getDescription());
                material.setType(MaterialType.valueOf(resourceRequest.getType().toUpperCase()));
                material.setFileUrl(resourceRequest.getUrl() != null ? resourceRequest.getUrl() : "");
                material.setFileName(resourceRequest.getTitle() + (resourceRequest.getFileType() != null ? "." + resourceRequest.getFileType() : ""));
                material.setFileSize(0L); // Default file size
                material.setCourse(course);
                material.setUploadedBy(professor);
                return material;
            })
            .collect(Collectors.toList());
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
