package com.heartlink.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Saves uploaded photos to a local directory on disk and serves them back
 * via the static resource mapping configured in WebConfig. Good for local
 * development and quick testing — NOT recommended for a real deployment
 * (files are lost on redeploy/container restart, and won't work at all
 * across multiple server instances). Switch storage.provider=s3 for prod.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private final Path uploadRoot;
    private final String baseUrl;

    public LocalStorageService(
            @Value("${storage.local.upload-dir}") String uploadDir,
            @Value("${storage.local.base-url}") String baseUrl) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl;
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory: " + uploadRoot, e);
        }
        log.info("Photo storage: LOCAL DISK at {} (dev/testing only)", uploadRoot);
    }

    @Override
    public String upload(String userId, MultipartFile file) throws IOException {
        String extension = extractExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;

        Path userDir = uploadRoot.resolve(userId);
        Files.createDirectories(userDir);

        Path target = userDir.resolve(filename);
        file.transferTo(target);

        return baseUrl + "/" + userId + "/" + filename;
    }

    @Override
    public void delete(String fileUrl) {
        try {
            String relative = fileUrl.substring(baseUrl.length() + 1);
            Path target = uploadRoot.resolve(relative).normalize();
            if (target.startsWith(uploadRoot)) {
                Files.deleteIfExists(target);
            }
        } catch (Exception e) {
            log.warn("Could not delete local file for url {}: {}", fileUrl, e.getMessage());
        }
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}
