package com.promptforge.shared.event;

import java.io.Serializable;
import java.time.LocalDateTime;

public class PromptCreatedEvent implements Serializable {
    private String eventId;
    private String promptId;
    private String title;
    private String userId;
    private String username;
    private String category;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    
    public PromptCreatedEvent() {}
    
    public static PromptCreatedEventBuilder builder() {
        return new PromptCreatedEventBuilder();
    }
    
    // Getters and Setters
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getPromptId() { return promptId; }
    public void setPromptId(String promptId) { this.promptId = promptId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public static class PromptCreatedEventBuilder {
        private String eventId, promptId, title, userId, username, category;
        private Boolean isPublic;
        private LocalDateTime createdAt;
        
        public PromptCreatedEventBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public PromptCreatedEventBuilder promptId(String promptId) { this.promptId = promptId; return this; }
        public PromptCreatedEventBuilder title(String title) { this.title = title; return this; }
        public PromptCreatedEventBuilder userId(String userId) { this.userId = userId; return this; }
        public PromptCreatedEventBuilder username(String username) { this.username = username; return this; }
        public PromptCreatedEventBuilder category(String category) { this.category = category; return this; }
        public PromptCreatedEventBuilder isPublic(Boolean isPublic) { this.isPublic = isPublic; return this; }
        public PromptCreatedEventBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        
        public PromptCreatedEvent build() {
            PromptCreatedEvent event = new PromptCreatedEvent();
            event.eventId = this.eventId;
            event.promptId = this.promptId;
            event.title = this.title;
            event.userId = this.userId;
            event.username = this.username;
            event.category = this.category;
            event.isPublic = this.isPublic;
            event.createdAt = this.createdAt;
            return event;
        }
    }
}