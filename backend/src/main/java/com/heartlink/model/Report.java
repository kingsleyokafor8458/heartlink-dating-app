package com.heartlink.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    private String reporterId;
    private String reportedUserId;

    // HARASSMENT, FAKE_PROFILE, INAPPROPRIATE_PHOTOS, SPAM, UNDERAGE, OTHER
    private String reason;
    private String details;

    @Builder.Default
    private String status = "PENDING"; // PENDING, REVIEWED, ACTIONED

    @CreatedDate
    private Instant createdAt;
}
