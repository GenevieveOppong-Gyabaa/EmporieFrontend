package com.mobiledev.emporio.Controller;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.mobiledev.emporio.Model.ChatMessage;

@Controller
public class ChatController {

    @Value("${upload.path}")
    private String uploadPath;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void send(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().toString());
        messagingTemplate.convertAndSendToUser(
            message.getReceiver(),
            "/queue/messages",
            message
        );
    }

    @PostMapping("/chat/uploadImage")
    public ChatMessage uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("receiver") String receiver, @RequestParam("sender") String sender) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG and PNG are allowed.");
        }

        File directory = new File(uploadPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadPath, fileName);
        Files.copy(file.getInputStream(), filePath);

        String imageUrl = "/images/" + fileName;
        ChatMessage imageMessage = new ChatMessage();
        imageMessage.setSender(sender);
        imageMessage.setReceiver(receiver);
        imageMessage.setImageUrl(imageUrl);
        imageMessage.setMessageType("IMAGE");
        imageMessage.setTimestamp(LocalDateTime.now().toString());

        messagingTemplate.convertAndSendToUser(receiver, "/queue/messages", imageMessage);
        return imageMessage;
    }

    @GetMapping("/images/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Path file = Paths.get(uploadPath).resolve(filename);
        Resource resource;
        try {
            resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read the file!");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
