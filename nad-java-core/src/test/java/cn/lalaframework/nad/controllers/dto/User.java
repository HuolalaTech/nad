package cn.lalaframework.nad.controllers.dto;

import java.io.Serializable;

@SuppressWarnings("ALL")
public class User implements Serializable {
    public String nickName;
    public transient long INS_TEMP_ID = 23333L;
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

    public boolean isActive() {
        return true;
    }

    public Boolean isEnabled() {
        return true;
    }

    public boolean isNotMember1(Void a) {
        return true;
    }

    public String isNotMember2() {
        return "";
    }
}
