package com.heartlink.dto;

import com.heartlink.model.User;

import java.util.List;

public record UserDto(
        String id,
        String name,
        Integer age,
        String gender,
        String bio,
        String city,
        String country,
        List<String> photoUrls,
        List<String> interests,
        boolean verified,
        boolean online
) {
    public static UserDto from(User u) {
        return new UserDto(
                u.getId(), u.getName(), u.getAge(), u.getGender(), u.getBio(),
                u.getCity(), u.getCountry(), u.getPhotoUrls(), u.getInterests(),
                u.isVerified(), u.isOnline()
        );
    }
}
