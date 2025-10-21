package com.promptforge.prompt.repository;

import com.promptforge.prompt.document.PromptVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromptVersionRepository extends MongoRepository<PromptVersion, String> {
    
    List<PromptVersion> findByPromptIdOrderByCreatedAtDesc(String promptId);
    
    Optional<PromptVersion> findByPromptIdAndVersion(String promptId, String version);
    
    Long countByPromptId(String promptId);
}