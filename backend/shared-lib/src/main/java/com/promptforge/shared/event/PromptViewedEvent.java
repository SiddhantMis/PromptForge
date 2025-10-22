package com.promptforge.shared.event;

import java.io.Serializable;
import java.time.LocalDateTime;

public class PromptViewedEvent implements Serializable {
    private String eventId;
    private String promptId;
    private String userId;
    private LocalDateTime viewedAt;
    
    public PromptViewedEvent() {}
    
    public static PromptViewedEventBuilder builder() {
        return new PromptViewedEventBuilder();
    }
    
    // Getters and Setters
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getPromptId() { return promptId; }
    public void setPromptId(String promptId) { this.promptId = promptId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public LocalDateTime getViewedAt() { return viewedAt; }
    public void setViewedAt(LocalDateTime viewedAt) { this.viewedAt = viewedAt; }
    
    public static class PromptViewedEventBuilder {
        private String eventId, promptId, userId;
        private LocalDateTime viewedAt;
        
        public PromptViewedEventBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public PromptViewedEventBuilder promptId(String promptId) { this.promptId = promptId; return this; }
        public PromptViewedEventBuilder userId(String userId) { this.userId = userId; return this; }
        public PromptViewedEventBuilder viewedAt(LocalDateTime viewedAt) { this.viewedAt = viewedAt; return this; }
        
        public PromptViewedEvent build() {
            PromptViewedEvent event = new PromptViewedEvent();
            event.eventId = this.eventId;
            event.promptId = this.promptId;
            event.userId = this.userId;
            event.viewedAt = this.viewedAt;
            return event;
        }
    }
}