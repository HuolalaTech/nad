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
        User user = new User();
        user.setId(1L);
        user.setName(name);
        user.setType((userType));
        return user;
    }

    @GetMapping("/setRole")
    Role setRole(@RequestParam Role type) {
        return type;
    }
}
