package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadMethod extends NadDef {
    @NonNull
    List<String> getTypeParameters();

    @NonNull
    String getReturnType();

    @NonNull
    List<NadParameter> getParameters();

    int getModifiers();
}
