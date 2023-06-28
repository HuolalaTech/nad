package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.List;

public interface NadParameter {
    @Nullable
    String getName();

    @NonNull
    String getType();

    @NonNull
    List<NadAnnotation> getAnnotations();
}
