package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;

public interface NadParameter extends NadDef {
    @NonNull
    String getType();
}
