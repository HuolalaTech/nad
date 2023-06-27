package cn.lalaframework.nad.dto.impl;

import cn.lalaframework.nad.dto.NadEnum;
import cn.lalaframework.nad.dto.NadEnumConstant;
import org.springframework.lang.NonNull;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class NadEnumImpl extends NadDefImpl implements NadEnum {
    @NonNull
    private final List<NadEnumConstant> constants;

    public NadEnumImpl(@NonNull Class<? extends Enum<?>> clz) {
        super(clz);
        List<Field> fields = Arrays.stream(clz.getDeclaredFields())
                .filter(i -> !Modifier.isStatic(i.getModifiers()))
                .collect(Collectors.toList());
        fields.forEach(ReflectionUtils::makeAccessible);

        constants = Arrays.stream(clz.getEnumConstants())
                .map(i -> new NadEnumConstantImpl(i, fields))
                .collect(Collectors.toList());
    }

    @NonNull
    public List<NadEnumConstant> getConstants() {
        return constants;
    }
}
