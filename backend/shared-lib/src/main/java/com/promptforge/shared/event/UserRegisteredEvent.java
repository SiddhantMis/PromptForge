package com.promptforge.shared.event;

import java.io.Serializable;
import java.time.LocalDateTime;

public class UserRegisteredEvent implements Serializable {
    
    private String eventId;
    private String userId;
    private String username;
    private String email;
    private LocalDateTime registeredAt;
    private String ipAddress;
    
    public UserRegisteredEvent() {
    }
    
    public UserRegisteredEvent(String eventId, String userId, String username, String email, 
                               LocalDateTime registeredAt, String ipAddress) {
        this.eventId = eventId;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.registeredAt = registeredAt;
        this.ipAddress = ipAddress;
    }
    
    public static UserRegisteredEventBuilder builder() {
        return new UserRegisteredEventBuilder();
    }
    
    // Getters and Setters
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    // Builder
    public static class UserRegisteredEventBuilder {
        private String eventId;
        private String userId;
        private String username;
        private String email;
        private LocalDateTime registeredAt;
        private String ipAddress;
        
        public UserRegisteredEventBuilder eventId(String eventId) {
            this.eventId = eventId;
            return this;
        }
        
        public UserRegisteredEventBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }
        
        public UserRegisteredEventBuilder username(String username) {
            this.username = username;
            return this;
        }
        
        public UserRegisteredEventBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public UserRegisteredEventBuilder registeredAt(LocalDateTime registeredAt) {
            this.registeredAt = registeredAt;
            return this;
        }
        
        public UserRegisteredEventBuilder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }
        
        public UserRegisteredEvent build() {
            return new UserRegisteredEvent(eventId, userId, username, email, registeredAt, ipAddress);
        }
    }
}