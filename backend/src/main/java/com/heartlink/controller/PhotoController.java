package com.heartlink.controller;

import com.heartlink.dto.UserDto;
import com.heartlink.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/me/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping
    public UserDto upload(@AuthenticationPrincipal String userId,
                           @RequestParam("file") MultipartFile file) throws IOException {
        return photoService.addPhoto(userId, file);
    }

    @DeleteMapping
    public UserDto delete(@AuthenticationPrincipal String userId, @RequestParam("url") String url) {
        return photoService.removePhoto(userId, url);
    }
}
