package cn.lalaframework.nad.dto;

import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Map;

public interface NadEnumConstant {
    @NonNull
    String getName();

    @NonNull
    Map<String, Object> getProperties();

    @NonNull
    <E extends Enum<E>> E getValue();

    @NonNull
    List<NadAnnotation> getAnnotations();
}
