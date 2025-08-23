package com.campusmate.service;

import com.campusmate.entity.Response;
import com.campusmate.entity.Query;
import com.campusmate.repository.ResponseRepository;
import com.campusmate.repository.QueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResponseService {
    
    @Autowired
    private ResponseRepository responseRepository;
    
    @Autowired
    private QueryRepository queryRepository;
    
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }
    
    public Optional<Response> getResponseById(String id) {
        return responseRepository.findById(id);
    }
    
    @Transactional
    public Response createResponse(Response response) {
        // Let Hibernate auto-generate the UUID
        Response savedResponse = responseRepository.save(response);
        
        // Update query response count
        updateQueryResponseCount(response.getQuery().getId());
        
        return savedResponse;
    }
    
    public Response updateResponse(String id, Response responseDetails) {
        Response response = responseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Response not found"));
        
        response.setContent(responseDetails.getContent());
        response.setIsAccepted(responseDetails.getIsAccepted());
        
        return responseRepository.save(response);
    }
    
    public void deleteResponse(String id) {
        Response response = responseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Response not found"));
        
        String queryId = response.getQuery().getId();
        responseRepository.deleteById(id);
        
        // Update query response count
        updateQueryResponseCount(queryId);
    }
    
    public List<Response> getResponsesByQuery(String queryId) {
        return responseRepository.findByQueryIdOrderByCreatedAtDesc(queryId);
    }
    
    public List<Response> getResponsesByAuthor(String authorId) {
        return responseRepository.findByAuthorId(authorId);
    }
    
    public List<Response> getAcceptedResponses() {
        return responseRepository.findByIsAcceptedTrue();
    }
    
    public List<Response> searchResponses(String keyword) {
        return responseRepository.searchByKeyword(keyword);
    }
    
    public Long getResponseCountByAuthor(String authorId) {
        return responseRepository.countByAuthorId(authorId);
    }
    
    public List<Response> getTopResponses(Integer minUpvotes) {
        return responseRepository.findTopResponsesByUpvotes(minUpvotes);
    }
    
    @Transactional
    private void updateQueryResponseCount(String queryId) {
        Query query = queryRepository.findById(queryId)
            .orElseThrow(() -> new RuntimeException("Query not found"));
        
        long responseCount = responseRepository.countByQueryId(queryId);
        query.setResponseCount((int) responseCount);
        queryRepository.save(query);
    }
}
