package com.heartlink.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "matches")
public class Match {

    @Id
    private String id;

    private List<String> userIds; // exactly 2 user ids, sorted

    @CreatedDate
    private Instant createdAt;

    private Instant lastMessageAt;
}
