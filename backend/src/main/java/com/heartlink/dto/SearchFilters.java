package com.heartlink.dto;

public record SearchFilters(
        String query,     // matches against name (case-insensitive, partial)
        Integer minAge,
        Integer maxAge,
        String city,
        String interest    // matches if present in the candidate's interests list
) {
    public boolean isEmpty() {
        return query == null && minAge == null && maxAge == null && city == null && interest == null;
    }
}
