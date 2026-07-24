package com.heartlink.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private String name;
    private Integer age;
    private String gender;
    private List<String> interestedIn; // e.g. ["MALE", "FEMALE"]

    private String bio;
    private String city;
    private String country;

    private List<String> photoUrls;
    private List<String> interests; // e.g. ["Hiking", "Travel", "Music"]

    @Builder.Default
    private boolean verified = false;

    @Builder.Default
    private boolean online = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private List<String> roles = List.of("USER");

    @CreatedDate
    private Instant createdAt;

    private Instant lastActiveAt;
}
