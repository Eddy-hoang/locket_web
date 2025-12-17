package com.locket.service;

import com.locket.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    private Path getUploadPath() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }
    
    public String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Invalid file path");
        }
        
        String fileExtension = getFileExtension(originalFilename);
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        try {
            Path uploadPath = getUploadPath();
            Files.createDirectories(uploadPath);
            
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return fileName;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file. Please try again!");
        }
    }
    
    public void deleteFile(String fileName) {
        try {
            Path filePath = getUploadPath().resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            System.err.println("Could not delete file: " + fileName);
        }
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }
}