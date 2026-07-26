package com.heartlink.service.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Abstraction over "where uploaded photos live". Swap implementations via
 * the `storage.provider` property (local | s3) with zero changes to
 * calling code — see LocalStorageService and S3StorageService.
 */
public interface StorageService {

    /**
     * Stores the file under a key namespaced to the user (e.g. userId/uuid.jpg)
     * and returns a publicly accessible URL for it.
     */
    String upload(String userId, MultipartFile file) throws IOException;

    /**
     * Deletes a previously uploaded file, given the URL that upload() returned.
     */
    void delete(String fileUrl);
}
