package cn.lalaframework.nad.controllers.dto;

import java.io.Serializable;

public class User implements Serializable {
    private Long id;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String nickName;

    public transient long INS_TEMP_ID = 23333L;
}
