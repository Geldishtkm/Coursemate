package com.campusmate.service;

import com.campusmate.entity.Course;
import com.campusmate.entity.Subject;
import com.campusmate.entity.User;
import com.campusmate.entity.CourseMaterial;
import com.campusmate.dto.request.CreateCourseRequest;
import com.campusmate.enums.UserRole;
import com.campusmate.enums.MaterialType;
import com.campusmate.enums.DifficultyLevel;
import com.campusmate.repository.CourseRepository;
import com.campusmate.repository.SubjectRepository;
import com.campusmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
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
        try {
            System.out.println("Starting course creation for: " + request.getTitle());
            
            // Create or find subject by name
            System.out.println("Creating/finding subject: " + request.getSubjectName());
            Subject subject = createOrFindSubject(request.getSubjectName());
            System.out.println("Subject created/found: " + subject.getId());
            
            // Create professor user
            System.out.println("Creating professor: " + request.getProfessorName());
            User professor = createProfessorUser(request.getProfessorName());
            professor = userRepository.save(professor);
            System.out.println("Professor saved: " + professor.getId());

            // Create course
            System.out.println("Creating course entity");
            Course course = createCourseEntity(request, subject, professor);
            course = courseRepository.save(course);
            System.out.println("Course saved: " + course.getId());

            // Force flush to ensure data is persisted
            courseRepository.flush();
            System.out.println("Course flush completed");

            System.out.println("Course creation completed successfully");
            return course;
        } catch (Exception e) {
            // Log the error and rethrow with more details
            System.err.println("Error creating course: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create course: " + e.getMessage(), e);
        }
    }

    private User createProfessorUser(String professorName) {
        // First check if professor already exists by email
        String email = "professor@" + professorName.toLowerCase().replace(" ", "") + ".edu";
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        }
        
        // Create new professor if doesn't exist
        User professor = new User();
        String[] names = professorName.trim().split("\\s+");
        professor.setFirstName(names[0]); // First name
        
        // Ensure lastName is never empty (required by @NotBlank)
        if (names.length > 1) {
            // Join all remaining parts as last name
            professor.setLastName(String.join(" ", java.util.Arrays.copyOfRange(names, 1, names.length)));
        } else {
            professor.setLastName("Professor"); // Default last name
        }
        professor.setEmail(email);
        professor.setPassword(passwordEncoder.encode("defaultPassword123")); // Set encoded default password
        professor.setRole(UserRole.TUTOR);
        professor.setIsActive(true);
        return professor;
    }

    private Subject createOrFindSubject(String subjectName) {
        // First try to find existing subject by name
        Optional<Subject> existingSubject = subjectRepository.findByNameIgnoreCase(subjectName);
        
        if (existingSubject.isPresent()) {
            return existingSubject.get();
        }
        
        // Generate unique code for new subject
        String baseCode = subjectName.substring(0, Math.min(4, subjectName.length())).toUpperCase();
        String code = baseCode;
        int counter = 1;
        
        // Ensure unique code
        while (subjectRepository.findByCode(code).isPresent()) {
            code = baseCode + counter++;
        }
        
        // If not found, create a new subject
        Subject newSubject = new Subject();
        newSubject.setName(subjectName);
        newSubject.setCode(code);
        newSubject.setDescription("Subject for " + subjectName);
        newSubject.setDepartment("General");
        newSubject.setCredits(3);
        newSubject.setDifficulty(DifficultyLevel.BEGINNER);
        
        return subjectRepository.save(newSubject);
    }

    private Course createCourseEntity(CreateCourseRequest request, Subject subject, User professor) {
        Course course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription() != null && !request.getDescription().trim().isEmpty() ? request.getDescription() : "Course description");
        course.setSubject(subject);
        course.setProfessor(professor);
        
        // Ensure semester and year are never null or empty (required by @NotBlank)
        course.setSemester(request.getSemester() != null && !request.getSemester().trim().isEmpty() ? request.getSemester() : "Fall 2024");
        course.setYear(request.getYear() != null && !request.getYear().trim().isEmpty() ? request.getYear() : "2024");
        
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
