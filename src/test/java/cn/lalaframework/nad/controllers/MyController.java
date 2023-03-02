package cn.lalaframework.nad.controllers;

import cn.lalaframework.nad.models.Role;
import cn.lalaframework.nad.models.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
