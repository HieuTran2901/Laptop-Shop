package com.laptopshop.backend.Service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public List<String> uploadImages(MultipartFile[] files) {
        List<String> urls = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                Map uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        Map.of(
                                "folder", "products",
                                "resource_type", "image"
                        )
                );

                urls.add(uploadResult.get("secure_url").toString());
            }
        } catch (Exception e) {
            throw new RuntimeException("Upload failed", e);
        }

        return urls;
    }
}
