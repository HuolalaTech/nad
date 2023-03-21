package cn.lalaframework.nad.controllers;

import cn.lalaframework.nad.models.Role;
import cn.lalaframework.nad.models.User;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class MyController {
    @GetMapping("/getUser")
    User getUser(@RequestParam String name, @RequestParam("type") String userType) {
        return new User();
    }

    @GetMapping("/setRole")
    Long setRole(@RequestParam Role type) {
        return System.currentTimeMillis();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Long upload(MultipartFile file) {
        if (file == null) return 0L;
        return System.currentTimeMillis();
    }

    @GetMapping(value = "/ui", produces = MediaType.TEXT_HTML_VALUE)
    String ui() {
        return String.format("<h1>Hello World at %d</h1>", System.currentTimeMillis());
    }
}
