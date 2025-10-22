package com.promptforge.prompt.service;

import com.promptforge.prompt.document.PromptVersion;
import com.promptforge.prompt.dto.CreatePromptRequest;
import com.promptforge.prompt.dto.PromptResponse;
import com.promptforge.prompt.dto.UpdatePromptRequest;
import com.promptforge.prompt.entity.Prompt;
import com.promptforge.prompt.repository.PromptRepository;
import com.promptforge.prompt.repository.PromptVersionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PromptService Tests")
class PromptServiceTest {
    
    @Mock
    private PromptRepository promptRepository;
    
    @Mock
    private PromptVersionRepository promptVersionRepository;
    
    @InjectMocks
    private PromptService promptService;
    
    private CreatePromptRequest createRequest;
    private UpdatePromptRequest updateRequest;
    private Prompt prompt;
    private String userId = "user-123";
    private String username = "testuser";
    
    @BeforeEach
    void setUp() {
        createRequest = new CreatePromptRequest();
        createRequest.setTitle("Test Prompt");
        createRequest.setContent("This is test content for the prompt");
        createRequest.setDescription("Test description");
        createRequest.setCategory("Development");
        createRequest.setIsPublic(true);
        createRequest.setModel("GPT-4");
        
        Set<String> tags = new HashSet<>();
        tags.add("test");
        tags.add("development");
        
        prompt = Prompt.builder()
                .id("prompt-123")
                .title("Test Prompt")
                .content("This is test content for the prompt")
                .description("Test description")
                .userId(userId)
                .username(username)
                .category("Development")
                .tags(tags)
                .isPublic(true)
                .model("GPT-4")
                .version("1.0.0")
                .viewCount(0)
                .forkCount(0)
                .likeCount(0)
                .rating(0.0)
                .ratingCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        updateRequest = new UpdatePromptRequest();
        updateRequest.setContent("Updated content for the prompt");
        updateRequest.setChangeLog("Updated content");
    }
    
    @Test
    @DisplayName("Should create prompt successfully")
    void shouldCreatePrompt() {
        // Given
        when(promptRepository.save(any(Prompt.class))).thenReturn(prompt);
        
        // When
        PromptResponse response = promptService.createPrompt(createRequest, userId, username);
        
        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Test Prompt");
        assertThat(response.getUserId()).isEqualTo(userId);
        assertThat(response.getVersion()).isEqualTo("1.0.0");
        assertThat(response.getIsPublic()).isTrue();
        
        verify(promptRepository).save(any(Prompt.class));
        verify(promptVersionRepository).save(any(PromptVersion.class));
    }
    
    @Test
    @DisplayName("Should get prompt by ID successfully")
    void shouldGetPromptById() {
        // Given
        when(promptRepository.findById(anyString())).thenReturn(Optional.of(prompt));
        when(promptRepository.save(any(Prompt.class))).thenReturn(prompt);
        
        // When
        PromptResponse response = promptService.getPromptById("prompt-123", userId);
        
        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("prompt-123");
        assertThat(response.getViewCount()).isEqualTo(1); // Incremented
        
        verify(promptRepository).findById("prompt-123");
        verify(promptRepository).save(any(Prompt.class)); // Saves updated view count
    }
    
    @Test
    @DisplayName("Should throw exception when prompt not found")
    void shouldThrowExceptionWhenPromptNotFound() {
        // Given
        when(promptRepository.findById(anyString())).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> promptService.getPromptById("invalid-id", userId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Prompt not found");
        
        verify(promptRepository).findById("invalid-id");
    }
    
    @Test
    @DisplayName("Should throw exception when accessing private prompt without permission")
    void shouldThrowExceptionWhenAccessingPrivatePromptWithoutPermission() {
        // Given
        prompt.setIsPublic(false);
        when(promptRepository.findById(anyString())).thenReturn(Optional.of(prompt));
        
        // When & Then
        assertThatThrownBy(() -> promptService.getPromptById("prompt-123", "different-user"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Access denied");
        
        verify(promptRepository).findById("prompt-123");
    }
    
    @Test
    @DisplayName("Should get all public prompts")
    void shouldGetAllPublicPrompts() {
        // Given
        List<Prompt> prompts = Arrays.asList(prompt);
        Page<Prompt> page = new PageImpl<>(prompts);
        when(promptRepository.findByIsPublicTrue(any(Pageable.class))).thenReturn(page);
        
        // When
        Page<PromptResponse> result = promptService.getAllPrompts(PageRequest.of(0, 10));
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Prompt");
        
        verify(promptRepository).findByIsPublicTrue(any(Pageable.class));
    }
    
    @Test
    @DisplayName("Should get user prompts")
    void shouldGetUserPrompts() {
        // Given
        List<Prompt> prompts = Arrays.asList(prompt);
        Page<Prompt> page = new PageImpl<>(prompts);
        when(promptRepository.findByUserId(anyString(), any(Pageable.class))).thenReturn(page);
        
        // When
        Page<PromptResponse> result = promptService.getUserPrompts(userId, PageRequest.of(0, 10));
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        
        verify(promptRepository).findByUserId(eq(userId), any(Pageable.class));
    }
    
    @Test
    @DisplayName("Should update prompt and create new version")
    void shouldUpdatePromptAndCreateNewVersion() {
        // Given
        when(promptRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.of(prompt));
        when(promptRepository.save(any(Prompt.class))).thenReturn(prompt);
        
        // When
        PromptResponse response = promptService.updatePrompt("prompt-123", updateRequest, userId);
        
        // Then
        assertThat(response).isNotNull();
        assertThat(response.getVersion()).isEqualTo("1.0.1"); // Version incremented
        
        verify(promptRepository).findByIdAndUserId("prompt-123", userId);
        verify(promptRepository).save(any(Prompt.class));
        verify(promptVersionRepository).save(any(PromptVersion.class)); // New version saved
    }
    
    @Test
    @DisplayName("Should throw exception when updating non-owned prompt")
    void shouldThrowExceptionWhenUpdatingNonOwnedPrompt() {
        // Given
        when(promptRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> promptService.updatePrompt("prompt-123", updateRequest, "different-user"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Prompt not found or access denied");
        
        verify(promptRepository).findByIdAndUserId("prompt-123", "different-user");
    }
    
    @Test
    @DisplayName("Should delete prompt successfully")
    void shouldDeletePrompt() {
        // Given
        when(promptRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.of(prompt));
        doNothing().when(promptRepository).delete(any(Prompt.class));
        
        // When
        promptService.deletePrompt("prompt-123", userId);
        
        // Then
        verify(promptRepository).findByIdAndUserId("prompt-123", userId);
        verify(promptRepository).delete(prompt);
    }
    
    @Test
    @DisplayName("Should search prompts by keyword")
    void shouldSearchPromptsByKeyword() {
        // Given
        List<Prompt> prompts = Arrays.asList(prompt);
        Page<Prompt> page = new PageImpl<>(prompts);
        when(promptRepository.searchPrompts(anyString(), anyBoolean(), any(Pageable.class))).thenReturn(page);
        
        // When
        Page<PromptResponse> result = promptService.searchPrompts("test", true, PageRequest.of(0, 10));
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        
        verify(promptRepository).searchPrompts(eq("test"), eq(true), any(Pageable.class));
    }
    
    @Test
    @DisplayName("Should get prompt versions")
    void shouldGetPromptVersions() {
        // Given
        PromptVersion version = PromptVersion.builder()
                .id("version-1")
                .promptId("prompt-123")
                .version("1.0.0")
                .content("Original content")
                .changeLog("Initial version")
                .createdAt(LocalDateTime.now())
                .build();
        
        List<PromptVersion> versions = Arrays.asList(version);
        when(promptVersionRepository.findByPromptIdOrderByCreatedAtDesc(anyString())).thenReturn(versions);
        
        // When
        List<PromptVersion> result = promptService.getPromptVersions("prompt-123");
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getVersion()).isEqualTo("1.0.0");
        
        verify(promptVersionRepository).findByPromptIdOrderByCreatedAtDesc("prompt-123");
    }
}