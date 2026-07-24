package com.heartlink.dto;

import java.util.List;

public record ProfileUpdateRequest(
        String name,
        Integer age,
        String bio,
        String city,
        String country,
        List<String> photoUrls,
        List<String> interests
) {}
