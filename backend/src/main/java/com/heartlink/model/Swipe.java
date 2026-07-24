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
@Document(collection = "swipes")
public class Swipe {

    @Id
    private String id;

    private String swiperId;
    private String targetId;

    // LIKE, PASS, SUPER_LIKE
    private String action;

    @CreatedDate
    private Instant createdAt;
}
