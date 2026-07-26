package com.heartlink.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

/**
 * Saves uploaded photos to an AWS S3 bucket. Active when
 * storage.provider=s3 (set STORAGE_PROVIDER=s3 as an env var in your
 * production deployment). Credentials are resolved by the AWS SDK's
 * default chain: env vars (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY),
 * ~/.aws/credentials, or an EC2/ECS instance role — nothing to hardcode.
 *
 * Bucket setup checklist:
 *  1. Create an S3 bucket (versioning optional, block public ACLs is fine).
 *  2. Add a bucket policy or CloudFront distribution that allows public
 *     GET on objects under the prefix this app writes to (or serve via
 *     signed URLs if you want photos private — swap upload()'s returned
 *     URL for a presigned GET URL in that case).
 *  3. Set env vars: STORAGE_PROVIDER=s3, S3_BUCKET=your-bucket, S3_REGION=...
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "s3")
public class S3StorageService implements StorageService {

    private final S3Client s3Client;
    private final String bucket;
    private final String region;

    public S3StorageService(
            @Value("${storage.s3.bucket}") String bucket,
            @Value("${storage.s3.region}") String region) {
        if (bucket == null || bucket.isBlank()) {
            throw new IllegalStateException("S3_BUCKET must be set when STORAGE_PROVIDER=s3");
        }
        this.bucket = bucket;
        this.region = region;
        this.s3Client = S3Client.builder().region(Region.of(region)).build();
        log.info("Photo storage: S3 bucket '{}' in region '{}'", bucket, region);
    }

    @Override
    public String upload(String userId, MultipartFile file) throws IOException {
        String extension = extractExtension(file.getOriginalFilename());
        String key = "photos/" + userId + "/" + UUID.randomUUID() + extension;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
                        file.getInputStream(), file.getSize())
        );

        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key);
    }

    @Override
    public void delete(String fileUrl) {
        try {
            String prefix = String.format("https://%s.s3.%s.amazonaws.com/", bucket, region);
            String key = fileUrl.startsWith(prefix) ? fileUrl.substring(prefix.length()) : fileUrl;
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (Exception e) {
            log.warn("Could not delete S3 object for url {}: {}", fileUrl, e.getMessage());
        }
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}
