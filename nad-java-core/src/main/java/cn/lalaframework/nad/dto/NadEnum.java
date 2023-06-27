package cn.lalaframework.nad.dto;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadEnum extends NadDef {
    @NonNull
    List<NadEnumConstant> getConstants();
}
