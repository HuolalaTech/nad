package cn.lalaframework.nad.dto;

import org.springframework.lang.NonNull;

import java.util.stream.Collectors;

public interface NadRoute extends NadRouteInfo, NadRouteHandler {
    /**
     * There are two advantages for this sort key:
     * 1. Methods on the same controller will be grouped together, because the package name is included.
     * 2. There is no conflict even if the methods are overloaded, because the parameters are included.
     */
    @NonNull
    static String getSortKey(@NonNull NadRoute route) {
        return String.format(
                "%s#%s(%s)",
                route.getBean(),
                route.getName(),
                route.getParameters().stream().map(NadParameter::getType).collect(Collectors.joining(","))
        );
    }
}
