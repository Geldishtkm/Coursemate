package com.campusmate.service;

import com.campusmate.entity.Subject;
import com.campusmate.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubjectService {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
    
    public Optional<Subject> getSubjectById(String id) {
        return subjectRepository.findById(id);
    }
    
    public Subject createSubject(Subject subject) {
        subject.setId(UUID.randomUUID().toString());
        return subjectRepository.save(subject);
    }
    
    public Subject updateSubject(String id, Subject subjectDetails) {
        Subject subject = subjectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        subject.setName(subjectDetails.getName());
        subject.setDescription(subjectDetails.getDescription());
        subject.setDepartment(subjectDetails.getDepartment());
        subject.setCredits(subjectDetails.getCredits());
        subject.setDifficulty(subjectDetails.getDifficulty());
        subject.setPrerequisites(subjectDetails.getPrerequisites());
        subject.setTopics(subjectDetails.getTopics());
        
        return subjectRepository.save(subject);
    }
    
    public void deleteSubject(String id) {
        subjectRepository.deleteById(id);
    }
    
    public List<Subject> getSubjectsByDepartment(String department) {
        return subjectRepository.findByDepartment(department);
    }
    
    public List<Subject> getSubjectsByDifficulty(String difficulty) {
        return subjectRepository.findByDifficulty(difficulty);
    }
    
    public List<Subject> searchSubjects(String keyword) {
        return subjectRepository.searchByKeyword(keyword);
    }
    
    public List<Subject> getSubjectsByCredits(Integer credits) {
        return subjectRepository.findByCredits(credits);
    }
    
    public List<Subject> getSubjectsByPrerequisite(String prerequisite) {
        return subjectRepository.findByPrerequisite(prerequisite);
    }
}
