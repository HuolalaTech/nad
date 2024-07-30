package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;

import java.util.Map;

public interface NadEnumConstant extends NadDef {
    @NonNull
    Map<String, Object> getProperties();

    @NonNull
    <E extends Enum<E>> E getValue();
}
