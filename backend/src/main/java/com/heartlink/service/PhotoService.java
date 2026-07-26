package com.heartlink.service;

import com.heartlink.dto.UserDto;
import com.heartlink.exception.ApiException;
import com.heartlink.model.User;
import com.heartlink.repository.UserRepository;
import com.heartlink.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB, matches application.yml
    private static final int MAX_PHOTOS = 6;

    private final UserRepository userRepository;
    private final StorageService storageService;

    public UserDto addPhoto(String userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new ApiException("Only JPEG, PNG, or WEBP images are allowed", HttpStatus.BAD_REQUEST);
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ApiException("Image must be smaller than 5MB", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        List<String> photos = user.getPhotoUrls() != null ? new ArrayList<>(user.getPhotoUrls()) : new ArrayList<>();
        if (photos.size() >= MAX_PHOTOS) {
            throw new ApiException("Maximum of " + MAX_PHOTOS + " photos allowed", HttpStatus.BAD_REQUEST);
        }

        String url = storageService.upload(userId, file);
        photos.add(url);
        user.setPhotoUrls(photos);
        user = userRepository.save(user);

        return UserDto.from(user);
    }

    public UserDto removePhoto(String userId, String photoUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        List<String> photos = user.getPhotoUrls() != null ? new ArrayList<>(user.getPhotoUrls()) : new ArrayList<>();
        if (!photos.remove(photoUrl)) {
            throw new ApiException("Photo not found on this profile", HttpStatus.NOT_FOUND);
        }
        user.setPhotoUrls(photos);
        user = userRepository.save(user);

        storageService.delete(photoUrl);

        return UserDto.from(user);
    }
}
