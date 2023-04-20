package cn.lalaframework.nad.controllers.dto;

public enum Role {
    ADMIN(7, "administrator"),
    DEV(11, "developer");

    private final int code;
    private final String description;

    Role(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
