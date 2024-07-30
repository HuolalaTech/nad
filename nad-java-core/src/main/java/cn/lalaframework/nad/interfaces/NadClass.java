package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.List;

public interface NadClass extends NadDef {
    @Nullable
    String getSuperclass();

    @NonNull
    List<NadMember> getMembers();

    @NonNull
    List<String> getTypeParameters();

    @NonNull
    List<String> getInterfaces();

    @NonNull
    List<String> getInnerClasses();

    @NonNull
    List<NadMethod> getImportantMethods();
}
